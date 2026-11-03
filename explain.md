# 當八字遇見人類圖｜專案講解（面試用）

這份文件對照 D-Link「前端工程師」JD，說明這個專案的前端設計、部署方式與 CI/CD。

- 正式網站：https://humandesign-64ea8.web.app
- 原始碼：https://github.com/ShackArbeit/HumanDesign

---

## 一、前端（對應 JD：React、串接 RESTful API、HTML/CSS/JS）

### 1. 前端如何與後端互動（如何串 API）

前端分成三層，**元件裡完全不寫 `fetch`**：

```text
元件（BookingForm、AvailabilityWeekGrid、MyBookings）
   │  呼叫 hook
   ▼
hooks/（useAvailability、useCreateBooking、useCancelBooking、useMyBookings）
   │  React Query 管快取、載入、錯誤、重新整理
   ▼
api/（availability.js、bookings.js）       每個資源一支檔案，只負責 HTTP
   │
   ▼
api/client.js  apiRequest()                所有請求的唯一出口
   ├─ 組網址：/api/v1 + 路徑 + 查詢參數
   ├─ 已登入時自動加上 Authorization: Bearer <Firebase ID token>
   ├─ 10 秒逾時（AbortController）
   └─ 非 2xx 一律轉成 ApiError { status, code, message, details }
   │
   ▼  fetch('/api/v1/...')  ← 相對路徑，同網域，不需要 CORS
Firebase Hosting ──rewrite /api/**──► Cloud Run（Express）
```

| Method | Path | 用途 | 登入 |
|---|---|---|---|
| GET | `/api/v1/availability?from&to&durationMin` | 週曆時段狀態 | 不用 |
| POST | `/api/v1/bookings` | 建立預約（會員或訪客） | 選用 |
| GET | `/api/v1/me/bookings` | 我的預約 | 必要 |
| DELETE | `/api/v1/bookings/:id` | 取消預約（會員本人，或訪客帶 `?token=`） | 本人或 token |
| GET | `/api/v1/health` | 健康檢查 | 不用 |

**錯誤處理：** 後端統一回傳 `{ error: { code, message } }`，前端依 `status` 分別處理：

- `409 SLOT_TAKEN`：關閉表單、提示「剛剛被別人預約了」，並重新抓週曆。
- `422`：表單內顯示原因，例如「未滿 3 天」。
- 網路錯誤或逾時：轉成 `ApiError`，畫面顯示「重試」按鈕。

> 面試可以講：「我把 API 呼叫收斂到一個 client，token、逾時、錯誤格式都只在一個地方處理，元件只關心資料和畫面。」

### 2. 前端如何管理 state

沒有用 Redux，依資料來源分成四種：

| 類型 | 工具 | 例子 |
|---|---|---|
| 伺服器資料 | React Query | 週曆、我的預約 |
| 全站登入狀態 | React Context（`AuthProvider`） | 目前使用者、登出 |
| 元件 UI 狀態 | `useState` | 目前是哪一週、選中的時段、手機選單開關 |
| 表單狀態 | react-hook-form + zod | 服務、Email、備註與驗證規則 |

靜態內容（服務、價格、文案）直接從 `data/` import，不需要 state。

React Query 的做法：

- `lib/queryKeys.js` 集中管理 key，例如 `['availability', weekStart, durationMin]`。
- `staleTime: 30s`；切換週時用 `keepPreviousData`，畫面不會閃白。
- 先 `prefetchQuery` 下一週，按「下一週」時不用等。
- 預約或取消後 `invalidateQueries`，週曆和我的預約自動更新。
- 登出時 `queryClient.clear()`，避免下一位使用者看到上一位的資料。

> 面試可以講：「伺服器資料交給 React Query，全域只放登入狀態，其餘留在元件內，不必為了小專案引入 Redux。」

### 3. 會員註冊與登入（詳細說明）

#### 3-1. 帳號密碼放在哪裡？

**Firebase 就是 GCP 的一部分。** Firebase 專案 `humandesign-64ea8` 本身就是一個 GCP 專案，會員帳號存在 **Firebase Authentication**，背後是 GCP 的 Identity Toolkit API。

```text
┌──────────── GCP 專案 humandesign-64ea8 ────────────┐
│                                                    │
│  Firebase Authentication   會員帳號、雜湊後的密碼  │
│  Firestore                 預約資料（沒有帳號資料）│
│  Cloud Run                 後端程式                │
│  Firebase Hosting          前端檔案                │
│                                                    │
└────────────────────────────────────────────────────┘
```

- 密碼由 Firebase 用 scrypt 雜湊保存，**連我們自己也看不到原始密碼**。
- 我們的 Firestore 沒有使用者資料表，只在預約裡存會員的 `uid`。
- 會員清單：Firebase Console → Authentication → Users。

#### 3-2. ID token：Google 簽發的「數位身分證」

登入成功後，Google 會發一張 **ID token**（JWT 格式），由三段組成：

```text
eyJhbGciOiJSUzI1NiJ9 . eyJ1aWQiOiJhYmMiLCJlbWFpbCI6Ii4uLiJ9 . SflKxwRJSMeKKF2QT4f...
└──── Header ────┘     └────────── Payload ──────────┘        └──── Signature ────┘
  演算法 RS256           uid、email                              Google 用私鑰簽名
                        aud = humandesign-64ea8（給哪個專案）
                        iss = securetoken.google.com/...（誰簽發）
                        exp = 1 小時後過期
```

- **Payload 任何人都讀得到**，就像身分證上的資料。
- **Signature 只有 Google 做得出來**，就像身分證的防偽浮水印。
- 有效期限 1 小時，Firebase SDK 會在背景自動換新。

#### 3-3. 從登入到預約的 8 個步驟

```text
  瀏覽器（React）           Firebase Auth（Google）       Cloud Run（我們的後端）
       │                            │                              │
 ① 輸入 Email／密碼                  │                              │
       │── ② 送出帳號密碼 ─────────►│                              │
       │                     ③ 比對雜湊後的密碼                     │
       │◄── ④ 回傳 ID token ────────│                              │
 ⑤ SDK 保存 token（瀏覽器）          │                              │
       │── ⑥ POST /api/v1/bookings  ＋ Authorization: Bearer token ─►│
       │                            │                    ⑦ verifyIdToken 驗證
       │◄── ⑧ 201 預約成功，bookings.userId = uid ──────────────────│
```

對應程式：

| 步驟 | 檔案 |
|---|---|
| ①② 登入表單 | `web/src/features/auth/SignIn.jsx`（`signInWithEmailAndPassword`） |
| ⑤ 監聽登入狀態 | `web/src/features/auth/AuthProvider.jsx`（`onAuthStateChanged`） |
| ⑥ 自動帶 token | `web/src/api/client.js`（`buildHeaders` → `getIdToken()`） |
| ⑦ 驗證 token | `server/src/middleware/auth.js`（`verifyIdToken`） |
| ⑧ 存入預約 | `server/src/routes/bookings.js`（`userId: user.uid`） |

#### 3-4. 後端怎麼確認 token 是真的？

`verifyIdToken` 會檢查四件事，全部通過才相信：

1. **簽章：** 用 Google 公開的公鑰驗證，確認是 Google 私鑰簽出來的。
2. **aud：** 是否等於 `humandesign-64ea8`，也就是發給我們專案的。
3. **iss：** 簽發者是否是 Google。
4. **exp：** 是否還沒過期。

| 有人想作弊 | 結果 |
|---|---|
| 竄改 token 裡的 uid | 簽章對不上 → `401` |
| 拿別的 Firebase 專案的 token | aud 不符 → `401` |
| 用過期的 token | exp 已過 → `401` |
| 沒帶 token 呼叫 `/me/bookings` | `requireAuth` → `401` |
| 沒帶 token 建立預約 | 視為訪客，必須填 Email |

- 後端不用每次去問 Firebase，公鑰會快取，在本機就能驗證，所以很快。
- 後端維持**無狀態**（不需要 session），Cloud Run 可以隨時擴展或縮到零。
- 訪客不需要帳號，用確認信中的取消 token 取消預約，資料庫只存 token 的 hash。

> 面試可以講：「帳號交給 Firebase，後端只用 Google 的公鑰驗證 ID token 的簽章，所以我不用存密碼，後端也維持無狀態。」

### 4. 前端資料夾依功能怎麼切

```text
web/src/
├─ api/            只負責 HTTP：client.js、availability.js、bookings.js
├─ hooks/          React Query：useAvailability、useBookingMutations、useMyBookings
├─ features/       依「功能」分，而不是依檔案類型
│  ├─ booking/     週曆、預約表單、預約成功畫面、我的預約、訪客取消頁
│  ├─ auth/        AuthProvider、RequireAuth、登入、註冊、忘記密碼
│  └─ content/     首頁、人類圖介紹、關於 Jerome、免費音檔、聯絡表單
├─ components/     共用 UI：PageContainer、LoadingSkeleton、ErrorState、EmptyState
├─ layout/         Header、Footer、Layout
├─ data/           靜態內容與顯示用價格
├─ lib/            firebase.js、datetime.js（統一台灣時間）、queryKeys.js
├─ styles/         tokens.css、global.css 與各元件的 CSS Modules
├─ test/           msw mock server、測試共用設定
├─ App.jsx         路由，並用 React.lazy 拆包
└─ main.jsx        掛上 MUI theme、React Query
```

好處：改 API 只動 `api/`；新增功能就在 `features/` 開資料夾；元件不知道後端網址；改動範圍清楚，方便 Code Review。

---

## 二、部署與 DevOps（對應 JD：自動化部署與維護）

### 1. 前後端分別部署（詳細說明）

#### 1-1. 為什麼要分開？

| | 前端 | 後端 |
|---|---|---|
| 本質 | **檔案**（HTML、CSS、JS） | **一直在跑的程式**（Node.js） |
| 在哪裡執行 | 使用者的瀏覽器 | Google 的機器 |
| 需要什麼 | 放在 CDN 讓人下載就好 | 要讀資料庫、密碼、寄信 |
| 比喻 | 印好的菜單 | 廚房 |
| 放在哪 | Firebase Hosting | Cloud Run（容器） |

#### 1-2. 前端部署：打包成檔案，上傳到 CDN

```text
web/src（JSX、CSS）
   │ npm --prefix web run build（Vite：轉譯、壓縮、拆包）
   ▼
web/dist
   ├─ index.html
   └─ assets/index-BxN6PiqI.js   ← 檔名含內容 hash，可長期快取
   │ firebase deploy --only hosting
   ▼
Firebase Hosting：上傳檔案 → 建立新 release → 全球 CDN 同步
```

- `VITE_FIREBASE_*` 等環境變數在 **build 時**寫進 JS，所以 CI 打包時要提供這些變數。
- 檔名含 hash，內容變了檔名就變，所以 `/assets/**` 可以設定一年長快取。

#### 1-3. 後端部署：打包成容器，交給 Cloud Run

```text
server/（原始碼）
   │ scripts/deploy-api.sh → gcloud run deploy --source server
   ▼
Cloud Build：依 Dockerfile 建 Docker 映像
   ▼
Artifact Registry：存放映像
   ▼
Cloud Run：建立新 revision（例如 humandesign-api-00008-dxt）
   │ 注入環境變數與 Secret（Gmail 帳密）
   ▼
健康檢查通過 → 100% 流量切到新版本
```

#### 1-4. 兩邊各自獨立

| 項目 | 前端 | 後端 |
|---|---|---|
| 放在哪 | Firebase Hosting | Cloud Run |
| 部署指令 | `firebase deploy --only hosting` | `scripts/deploy-api.sh` |
| 版本紀錄 | Hosting 發布記錄（releases） | Cloud Run revisions |
| 回復方式 | Console 一鍵回復舊版 | 把流量切回舊 revision |
| 什麼時候要部署 | 改畫面、文案 | 改 API、預約規則 |

> 注意：API 介面改變時要注意順序。例如移除內容 API 時，我先上新前端（不再呼叫它），再切後端流量，過程中網站沒有壞掉。

#### 1-5. 整體圖

```text
                         GitHub repo（ShackArbeit/HumanDesign）
                                       │ push main
                ┌──────────────────────┴──────────────────────┐
                ▼ 後端                                         ▼ 前端
  scripts/deploy-api.sh                          npm --prefix web run build
                │                                              │
   Cloud Build → Artifact Registry → Cloud Run   firebase deploy → Firebase Hosting
```

### 2. 使用者請求怎麼走：Hosting rewrite（詳細說明）

#### 2-1. Firebase Hosting 像大樓的櫃台

所有請求都先到 Firebase Hosting，它依 `firebase.json` 的規則分派：

```json
"rewrites": [
  { "source": "/api/**", "run": { "serviceId": "humandesign-api", "region": "asia-east1" } },
  { "source": "**", "destination": "/index.html" }
]
```

| 順序 | 規則 | 處理方式 |
|---|---|---|
| 1 | 要的檔案真的存在 | 直接回傳那個檔案 |
| 2 | 網址開頭是 `/api/` | 轉給 Cloud Run，把結果交回瀏覽器 |
| 3 | 其他所有網址 | 回傳 `index.html`，由 React Router 決定顯示哪一頁 |

#### 2-2. 四個請求實際怎麼走

| 瀏覽器要的網址 | 符合規則 | 結果 |
|---|---|---|
| `/` | 3 | `index.html`，React 顯示首頁 |
| `/assets/index-xxxx.js` | 1 | 直接回傳 JS 檔 |
| `/booking` | 3 | 沒有這個檔案 → `index.html` → React Router 顯示預約頁 |
| `/api/v1/availability?...` | 2 | 轉給 Cloud Run → 回傳 JSON |

```text
瀏覽器 ── https://humandesign-64ea8.web.app/api/v1/availability
   │
   ▼
Firebase Hosting（櫃台）──規則 2──► Cloud Run（Express）
   ▲                                     │ 查 Firestore、計算時段
   └──────────── JSON 回應 ◄─────────────┘
瀏覽器網址列始終是 web.app，看不到 Cloud Run
```

規則 3 也解決了舊版 GitHub Pages「重新整理子頁面出現 404」的問題。

#### 2-3. 如果沒有 rewrite 會怎樣？

| | 沒有 rewrite | 有 rewrite（目前做法） |
|---|---|---|
| 前端呼叫 | `https://humandesign-api-xxxx.a.run.app/api/v1/...` | `/api/v1/...` |
| 網域 | 前端和後端不同網域 | 同一個網域 |
| 瀏覽器同源政策 | 會擋，後端要另外設定 CORS | 不受影響，免 CORS |
| 後端網址 | 寫死在前端程式裡，外露 | 不出現在前端 |
| 換後端網址 | 前端要改程式並重新部署 | 只改 `firebase.json` |

> 面試可以講：「前端放 Firebase Hosting，後端用 Cloud Run 跑容器化的 Express，再透過 Hosting 的 rewrite 讓兩者同網域，省掉 CORS，後端網址也不會外露。」

### 3. CI/CD 如何執行

```text
開發者 ──► 開 PR 或 push main
               │
      ┌────────┴─────────────────────────────┐
      ▼                                      ▼
┌─ ci.yml（PR 與 push main）───────┐  ┌─ deploy.yml ─────────────────────────┐
│ web job（平行）                  │  │ push main → production job            │
│  npm ci → lint → test → build    │  │  1. Checkout                           │
│  （31 個前端測試，msw 模擬 API）  │  │  2. Workload Identity Federation       │
│                                  │  │     換取短期憑證（無 JSON key）        │
│ server job（平行）               │  │  3. Setup gcloud / Node                │
│  安裝 Java + Firebase CLI        │  │  4. deploy-api.sh → Cloud Run          │
│  npm ci → lint                   │  │  5. 用 repo 變數打包前端               │
│  → Firestore/Auth Emulator       │  │  6. firebase deploy hosting,firestore  │
│    上跑 54 個測試（含併發搶位）  │  │  7. smoke-test.sh 檢查線上網站         │
└──────────────────────────────────┘  │                                        │
                                      │ PR → preview job                       │
                                      │  打包前端 → Hosting 預覽網址（7 天）   │
                                      └────────────────────────────────────────┘
```

**Workload Identity Federation：**

```text
GitHub Actions ──OIDC token（證明自己是 ShackArbeit/HumanDesign）──►
  GCP Workload Identity Pool「github」（只信任這個 repo）──►
  換成 github-deployer 服務帳戶的短期憑證 ──► 執行部署
```

- repo 裡沒有任何雲端金鑰，GitHub 只存 Variables，而且都不是密碼。
- Gmail 密碼放在 Secret Manager，Cloud Run 執行時才讀取。
- 2026-11-02 實際觸發一次自動部署，9 個步驟全部成功。

**改善空間：** 目前 `Deploy` 與 `CI` 同時觸發，部署不會等測試通過。下一步會讓 deploy 依賴 CI 的結果。

### 4. Docker 在過程中的角色

映像是在 Google 的 **Cloud Build** 上建置的，本機不需要開 Docker。

```text
server/
├─ Dockerfile
├─ .dockerignore / .gcloudignore   排除 node_modules、test、.env
├─ package.json、package-lock.json
└─ src/

gcloud run deploy --source server
   │ ① 上傳 server/ 原始碼（已排除 .env 等檔案）
   ▼
Cloud Build 依 Dockerfile 逐層建置：
   FROM node:20-slim          輕量 Node 映像
   ENV NODE_ENV=production
   COPY package*.json
   RUN npm ci --omit=dev      只裝正式環境套件
   COPY src ./src
   USER node                  不用 root 執行
   CMD ["node","src/index.js"]
   │ ② 推送映像
   ▼
Artifact Registry
   │ ③ 建立新 revision
   ▼
Cloud Run 啟動容器
   ├─ 注入環境變數：WEB_BASE_URL、TRUST_PROXY_HOPS、GOOGLE_CLOUD_PROJECT
   ├─ 注入 Secret：GMAIL_USER、GMAIL_APP_PASSWORD
   ├─ 監聽 PORT=8080，健康檢查通過後切流量
   └─ 沒流量時縮到 0，有請求再啟動
```

Docker 的價值：本機、CI、雲端環境一致；每次部署都是不可變的映像，出問題可以切回上一個 revision。

### 5. 選擇 Firebase + GCP + GitHub 的優勢

| 優勢 | 說明 |
|---|---|
| 同網域、免 CORS | Hosting rewrite `/api/**` 到 Cloud Run |
| 不用管伺服器 | Hosting 是 CDN，Cloud Run 自動擴縮、沒流量縮到 0 |
| 成本低 | 小流量多落在免費額度（需要 Blaze 方案，建議設預算警示） |
| 安全 | 無長期金鑰；密碼在 Secret Manager；Firestore 規則禁止前端直接存取 |
| 整合度高 | Auth、Firestore、Hosting、Cloud Run 在同一個專案 |
| 可測試 | Firebase Emulator 讓 CI 能測真正的 transaction 與 token 驗證 |
| 容易回復 | Cloud Run revision、Hosting 發布記錄都能切回舊版 |
| Code Review 友善 | PR 自動跑 CI，並產生預覽網址 |

---

## 三、正式網址

**前端**

- https://humandesign-64ea8.web.app
- https://humandesign-64ea8.firebaseapp.com（Firebase 備用網域）

**後端 API**

- 經由前端：https://humandesign-64ea8.web.app/api/v1 （例如 `/api/v1/health`）
- Cloud Run 直接網址：https://humandesign-api-vmscdikbzq-de.a.run.app
- 另一個 Cloud Run 網址：https://humandesign-api-395151610918.asia-east1.run.app

**GCP / Firebase 管理頁面**

- Cloud Run：https://console.cloud.google.com/run/detail/asia-east1/humandesign-api?project=humandesign-64ea8
- Cloud Build：https://console.cloud.google.com/cloud-build/builds?project=humandesign-64ea8
- Artifact Registry：https://console.cloud.google.com/artifacts?project=humandesign-64ea8
- Secret Manager：https://console.cloud.google.com/security/secret-manager?project=humandesign-64ea8
- Firebase Hosting：https://console.firebase.google.com/project/humandesign-64ea8/hosting/sites
- Firestore：https://console.firebase.google.com/project/humandesign-64ea8/firestore
- Authentication（會員）：https://console.firebase.google.com/project/humandesign-64ea8/authentication/users
- GitHub Actions：https://github.com/ShackArbeit/HumanDesign/actions

---

## 四、JD 尚未涵蓋的地方（面試前先想好怎麼回答）

- **開發內部工具：** 目前沒有管理頁，付款狀態要人工到 Firestore 修改，下一步可做管理頁。
- **公開 Review：** 已有 PR + CI + 預覽網址的流程，但這次都直接進 `main`，沒有實際的 review 紀錄。
- **Node 20 已過支援期限：** Dockerfile 與 CI 仍使用 Node 20，可列為下一步升級。
- **部署不等 CI：** 如上所述，下一步讓 deploy 依賴 CI。
