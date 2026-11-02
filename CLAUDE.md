# CLAUDE.md — HumanDesign 預約網站

> 這份文件給 Claude Code 讀。開始任何工作前先讀完，並依「工作階段」的順序推進。
> 擁有者：Shack（GitHub: ShackArbeit）。UI 文案一律繁體中文，程式碼、commit、變數名稱用英文。

---

## 0. 專案目的與背景

- 這是「當八字遇見人類圖｜Jerome HumanDesign」的介紹＋線上預約網站（人類圖解析服務）。
- **改版目的**：當作應徵 D-Link 友訊「平台前端工程師 (React)」的作品集。面試日 **2026-11-04**。
  JD 重點：React、串接 RESTful API、單元測試、內部工具、Code Review、自動化部署、對既有設計提出改善。
  JD 要求「攜帶作品，包含前端互動與 API 整合」，所以每個改動都要能在 demo 時講出**為什麼這樣設計**。
- 改版四大目標：
  1. 新增**前台可預約時段週曆**（參考下方「週曆規格」）。
  2. 把目前「後端回傳寫死的 mock data」改成**有邏輯分層、有資料庫、有驗證的 REST API**，前端統一 API 層。
  3. 前後端都部署到 **GCP**（Firebase Hosting + Cloud Run + Firestore），不用付費 VM。
  4. 修正 RWD 與視覺質感問題、修正人類圖內容錯誤。

---

## 1. 現況盤點（已檢視過的程式碼事實）

### 技術棧
- 前端（repo 根目錄）：React 18、Vite 4、MUI 5 + `@mui/x-date-pickers`、**同時**載入 Bootstrap（npm + CDN）、React Query v5、Context API、SweetAlert2、EmailJS。部署 GitHub Pages，`base: "/HumanDesign/"`。
- 後端（`Server/`）：Express 4、Mongoose（MongoDB Atlas）、express-session（MemoryStore）、Nodemailer（Gmail）。部署 Render（`https://humannode.onrender.com`）。
- 沒有任何測試；`npm run build` 可成功，但單一 JS bundle 約 915 kB。

### 🔴 安全問題（Phase 0 必須先處理）
1. `Server/Databse/ConnectToMongoDB.js` 寫死 MongoDB Atlas 帳密。
2. `Server/ForSendEmai/SendCheckEmail.js`、`NotAuthSendEmail.js`、`ForBookPage/ResendPassword.js` 寫死 Gmail 應用程式密碼。
3. Session secret 寫死在 `Server/Databse/Session.js`、`NoAuthSession.js`。
4. `src/PageComponents/EmailJormen/EmailJormen.jsx` 寫死 EmailJS service/template id（屬公開 key，但仍改用 env）。
> Shack 會自行到 Google / Atlas 撤銷並輪替憑證。**Claude Code 不得把任何憑證值寫進程式碼、文件、commit message 或測試**；只能用 `process.env.*` / `import.meta.env.*` 讀取，並提供 `.env.example`。

### 🟠 後端邏輯錯誤
| 位置 | 問題 |
|---|---|
| `ForBookPage/SaveAndDeleteInfo.js`、`ForCheckBooking/CheckBookingAuth.js`、`ForSendEmai/SendCheckEmail.js` | 用 `SignUpModel.distinct('Sessions')[0]` 找「目前使用者」，實際拿到的是**資料庫中第一個登入過的人**，多人同時使用會把預約/信件歸給錯的人。`NotAuthSendEmail.js` 同樣用 `distinct('Sessions')[0]`。 |
| `ForBookPage/SignUp.js`、`SignIn.js` | 密碼與 ConfirmPassword **明文**存資料庫；登入時把密碼存進 Sessions，並回傳給前端。 |
| `ForBookPage/ResendPassword.js` | 把明文密碼寄給使用者；查無 email 時不回應（請求卡住）。 |
| `deleteBooking/:id`、`noAuthDelete/:id` | 無權限檢查，知道 id 就能刪任何人的預約。 |
| 衝突檢查（SaveAndDeleteInfo / NoAuthBooking） | 把小時、分鐘拆開比較，跨整點會漏判；`for` 迴圈內直接 `return` 只檢查第一筆；固定 ±90 分鐘，但服務有 120 分鐘方案；查詢與寫入非原子操作，兩人同時送出會**重複預約**。 |
| `index.js` CORS | 先 `app.use(cors())`（全開）再加限制，且 origin 字串前有空白 → 限制無效。 |
| route 模組 | 有的 export `router`，有的 export 一個內含 session middleware 的子 `app`，行為不一致。 |
| `ForSubPage/WhatIsHumanDesign.js` | `/human/circleHuman` 重複註冊；`hoverHumanDesign[].url` 指向 `http://localhost:5173/...`，正式環境連結全壞。 |
| 時間 | 用 `new Date()` 的 `getHours()`，依伺服器時區；部署到雲端（UTC）時預約時間會錯 8 小時。 |

### 🟠 前端問題
- API base URL `https://humannode.onrender.com` 在約 20 處寫死；`Layout/Header.jsx` 登出打 `http://localhost:8000/logout`（正式環境壞掉）。
- `BasicCalendar.jsx` / `NotAuthBasicCalendar.jsx` / `AgainBookingCalendar.jsx` 三個約 410 行幾乎相同的元件；三個對應 Context（`DataTimeContext` / `NoAuthDateContext` / `ReBookingDateTimteContext`）也重複。
- **價格不一致**：後端 `BookingIntroduction.js` 是 60 / 90 分鐘，前端 `DataTimeContext.jsx` 與日曆元件是 60 / 120 分鐘。→ 見「待 Shack 確認」。
- 密碼存 `localStorage`（`remeberMePassword`），並用來決定路由是否註冊；`App.jsx` 會 `console.log` 帳密、`window.alert`。
- JSX 內用 `//` 當註解（會被當文字）；GitHub Pages + BrowserRouter 重新整理子路由會 404。
- Loading / error 只有一行 `<p>Loading...</p>`，沒有 error / empty state。

### 🟡 RWD / 視覺問題（實際在 375px 與 1280px 截圖檢視過）
- 斷點混亂：450 / 500 / 550 / 576 / 767 / 768 / 1000 / 1280px 混用；`Jerome.module.css` 沒有任何 media query。
- 字型：CSS 指定 `'Noto Sans TC'` 但**從未載入**，部分區塊（Footer、標題）落回襯線體（新細明體/Times），中英混排質感差。
- 首頁 hero：文字超出藍色斜切色塊、手機版文字貼齊螢幕邊緣（無 padding）、桌面下方大片留白。
- 首頁 `HomePageComponents/BriefIntroduce.jsx` 與 `Layout/Footer.jsx` 放了**與網站無關的 DW 德國新聞內容/圖片**（猶太社群新聞）→ 必須移除。
- Footer：手機版版權文字字級過大（換三行）；短頁面時 Footer 沒貼底，下方出現白色空隙。
- 日曆表單：DateTimePicker 預設就顯示紅框（錯誤狀態）；元件寬度寫死 `350px`；`Calendar.module.css` 高度寫死 `600px`。
- 登入表單把密碼規則寫在 placeholder，輸入後提示消失。
- 圖片全部 hotlink 第三方網站（sorehunter.com、sb-drops S3、wixstatic、dw.com、picsum）：有版權與失效風險，Logo 連到 google.com。
- `index.html`：`lang="en"`、title 是「人類圖 JavaScript」、多載入沒用到的 `apis.google.com/js/api.js` 與 Bootstrap JS。
- Logo `<img>` 無 alt；漢堡選單用 `<a>` 無 `aria-label`／鍵盤操作。

---

## 2. 目標架構

```
瀏覽器
  │  https://<project>.web.app
  ▼
Firebase Hosting ──(靜態檔) React SPA（rewrites ** → /index.html，解決子路由 404）
  │
  └─ rewrites /api/** ──► Cloud Run 服務 `humandesign-api`（Express, Node 20, 容器）
                              │ firebase-admin
                              ├─► Firestore（資料）
                              ├─► Firebase Auth（驗證 ID token）
                              └─► Secret Manager（Gmail app password 等）
```

決策與理由（面試時要能講）：
- **同網域 `/api/**` rewrite**：前端打相對路徑 `/api/v1/...`，不需要 CORS，也不用把後端網址寫進前端。
- **Firebase Hosting 只轉送名為 `__session` 的 cookie**，其他 cookie 會被移除 → 不使用 express-session，改用 **Firebase Auth ID token（`Authorization: Bearer`）**，後端無狀態，Cloud Run 可水平擴展。
- **Cloud Run** scale-to-zero、不付 VM 費用、保留 Express 寫法；需要 GCP 帳單（Blaze 方案），但此網站流量通常落在免費額度內。設定預算警示（例如 NT$100）。
- **Firestore** 取代 MongoDB：與 Firebase Auth/Hosting 整合、有 Emulator 可寫測試、用 transaction 防止重複預約。
- 區域：Cloud Run 與 Firestore 優先 `asia-east1`（彰化）。若 Hosting rewrite 不支援該區，改 `asia-northeast1`（東京），並在 README 記錄。
- 冷啟動：預設 `min-instances=0`。面試當天可暫時設 `--min-instances=1` 避免 demo 時等待，結束後改回。
- 寄信：保留 Nodemailer + Gmail App Password，密碼放 Secret Manager，以環境變數注入 Cloud Run。

---

## 3. 目標目錄結構

```
/
├─ CLAUDE.md
├─ README.md                 # 重寫：功能、架構圖、截圖、demo 連結、技術決策、踩過的坑
├─ firebase.json             # hosting + rewrites + emulators
├─ firestore.rules           # 前端不直接讀寫 Firestore → 全部 deny（只有後端 admin SDK 能存取）
├─ firestore.indexes.json
├─ .github/workflows/
│   ├─ ci.yml                # PR：lint + test + build（前後端）
│   └─ deploy.yml            # main：部署 Cloud Run + Firebase Hosting（Workload Identity Federation，不用 JSON key）
├─ web/                      # 前端（從根目錄搬入）
│   ├─ index.html
│   ├─ vite.config.js        # base 改為 "/"
│   ├─ .env.example          # VITE_API_BASE_URL=/api/v1, VITE_FIREBASE_*
│   └─ src/
│       ├─ api/              # client.js（fetch wrapper）+ 每個資源一支：services.js, availability.js, bookings.js, content.js
│       ├─ hooks/            # React Query hooks：useAvailability, useCreateBooking, useMyBookings, useContent...
│       ├─ lib/              # firebase.js, queryKeys.js, datetime.js（統一 Asia/Taipei）
│       ├─ features/
│       │   ├─ booking/      # AvailabilityWeekGrid, BookingForm, BookingSummary, MyBookings
│       │   ├─ auth/         # SignIn, SignUp, ForgotPassword（Firebase Auth）
│       │   └─ content/      # 人類圖介紹、About、Feedback
│       ├─ components/       # 共用：PageContainer, SectionTitle, LoadingSkeleton, ErrorState, EmptyState
│       ├─ layout/           # Header, Footer, Layout
│       ├─ styles/           # tokens.css（色彩/字級/間距/斷點）, global.css
│       └─ test/             # setup.js, msw handlers
└─ server/                   # 後端（取代 Server/）
    ├─ Dockerfile
    ├─ .env.example
    ├─ package.json
    ├─ src/
    │   ├─ app.js            # 建立 express app（測試可直接 import）
    │   ├─ index.js          # listen(process.env.PORT)
    │   ├─ config/           # env 讀取與驗證（zod）, scheduleRules 預設值
    │   ├─ middleware/       # auth.js（驗證 ID token）, validate.js, errorHandler.js, rateLimit.js
    │   ├─ routes/           # availability, bookings, content（API 與預約流程）
    │   ├─ lib/              # availability（純函式）, database（Firestore）, mail, firebase, errors
    │   └─ schemas/          # zod schema（request 驗證，前端可共用型別概念）
    ├─ scripts/seed.js       # 把現有 mock data 寫入 Firestore（含 emulator）
    └─ test/                 # vitest + supertest，搭配 Firestore Emulator
```

> 搬移策略：先在新目錄建好、確認可跑，再刪除舊的 `Server/`、根目錄前端檔、`dist/`、拼錯的 `.github/workfolws/`。用 `git mv` 保留歷史。

---

## 4. 資料模型（Firestore）

所有時間存 **UTC `Timestamp`**；顯示與營業時間計算一律用 `Asia/Taipei`（dayjs + utc + timezone plugin）。

| Collection | 文件欄位 | 說明 |
|---|---|---|
| `services/{serviceId}` | `name`, `description`, `options: [{ durationMin, priceTwd }]`, `imagePath`, `order`, `active` | 個人/多人/親子/團體解析。價格的唯一資料來源。 |
| `bookings/{bookingId}` | `userId \| null`, `guestEmail \| null`, `serviceId`, `durationMin`, `priceTwd`, `startAt`, `endAt`, `status: 'pending_payment' \| 'confirmed' \| 'cancelled'`, `cancelTokenHash \| null`, `createdAt`, `updatedAt` | 會員用 `userId`；訪客用 `guestEmail` + 取消 token（只存 hash）。 |
| `slotLocks/{yyyyMMdd-HHmm}` | `bookingId`, `startAt` | 每 30 分鐘一格的鎖。建立預約時在 **transaction** 內檢查並建立該預約涵蓋的所有格子 + buffer，任何一格已存在就回 409。取消時刪除。 |
| `settings/schedule` | `timezone: 'Asia/Taipei'`, `slotMinutes: 30`, `bufferMinutes: 30`, `minLeadDays: 3`, `maxAdvanceDays: 60`, `weekly: { mon: [{ start: '10:00', end: '12:00' }, ...], ... }` | 營業時間規則。 |
| `closures/{yyyy-MM-dd}` | `reason`（例如「國定假日休息」）, `ranges: [] \| null`（null = 整天） | 例外休息日。 |
| `content/{section}` | `items: [{ id, title, body, imagePath }]` | 人類圖介紹各分頁、首頁服務說明、預約流程。 |
| `aboutTimeline/{year}` | `title`, `body` | 認識 Jerome。 |
| `feedbackVideos/{id}` | `title`, `body`, `youtubeId` | 免費音檔。 |

`firestore.rules`：`allow read, write: if false;`（前端只透過 API 存取）。

---

## 5. REST API 規格（`/api/v1`）

### 共通規範
- 成功：`200/201` + `{ "data": ... }`；列表可加 `"meta"`。
- 失敗：`{ "error": { "code": "SLOT_TAKEN", "message": "此時段已被預約", "details": [...] } }`
  - `400 VALIDATION_ERROR`、`401 UNAUTHENTICATED`、`403 FORBIDDEN`、`404 NOT_FOUND`、`409 SLOT_TAKEN`、`422 OUTSIDE_BUSINESS_HOURS / TOO_SOON / TOO_FAR`、`429 RATE_LIMITED`、`500 INTERNAL`。
- 所有輸入用 zod 驗證；所有 async handler 走集中 `errorHandler`；不在 response 回傳密碼、token、其他人的 email。
- 公開內容 GET 加 `Cache-Control: public, max-age=300`；`availability` 用 `no-store`。
- `helmet`、`express-rate-limit`（POST /bookings 每 IP 每分鐘 10 次）、`morgan`/結構化 log（Cloud Logging 可讀的 JSON）。

### Endpoints
| Method | Path | Auth | 說明 |
|---|---|---|---|
| GET | `/health` | – | Cloud Run 健康檢查 |
| GET | `/services` | – | 服務與價格 |
| GET | `/content/:section` | – | `home-services`、`booking-process`、`hd-overview`、`hd-types`、`hd-profiles`、`hd-authority`、`hd-centers`、`hd-channels`、`hd-cross`、`hd-origin` |
| GET | `/about/timeline` | – | Jerome 經歷 |
| GET | `/feedback/videos` | – | 影片清單 |
| GET | `/availability?from=YYYY-MM-DD&to=YYYY-MM-DD&durationMin=60` | – | **週曆資料**（見下） |
| POST | `/bookings` | 選用 | 建立預約；有 Bearer token 綁會員，沒有則必填 `guestEmail`。成功後寄確認信。回 201。 |
| GET | `/me/bookings` | 必要 | 自己的預約（取代 `/checkBooking`） |
| DELETE | `/bookings/:id` | 會員本人或 `?token=` | 取消預約（距開始 < 24 小時回 422，規則依現有「預約須知」） |

> 註冊、登入、登出、忘記密碼全部改用 **Firebase Auth 前端 SDK**（`sendPasswordResetEmail`），刪除 `/signUp`、`/directSignIn`、`/logout`、`/resendPassword`。後端 `middleware/auth.js` 用 `firebase-admin` 的 `verifyIdToken`。

### `GET /availability` 回應
```json
{
  "data": {
    "timezone": "Asia/Taipei",
    "slotMinutes": 30,
    "days": [
      {
        "date": "2026-11-05",
        "weekday": 4,
        "closedReason": null,
        "slots": [
          { "start": "2026-11-05T02:00:00Z", "end": "2026-11-05T02:30:00Z", "status": "available" },
          { "start": "2026-11-05T02:30:00Z", "end": "2026-11-05T03:00:00Z", "status": "booked" }
        ]
      }
    ]
  }
}
```
- `status`：`available` | `booked` | `closed`（休息/非營業）| `past` | `too_soon`（未滿 3 天）。
- 若傳 `durationMin`，`available` 代表「從這格開始、整段 durationMin + buffer 都空」。
- **只回狀態，不回任何預約者資訊**。
- 計算放在 `lib/availability.js`，寫成**純函式** `computeAvailability({ rules, closures, bookings, from, to, now, durationMin })`，方便單元測試。
- `from`–`to` 最多 31 天，超過回 400。

---

## 6. 前台「可預約時段週曆」規格

參考 Shack 提供的醫院門診表截圖：上方「◀ 上一週｜2026年10月｜下一週 ▶」，表格欄位是日期（含星期），列是時段，格子顯示狀態。

### 元件：`features/booking/AvailabilityWeekGrid.jsx`
- 資料：`useAvailability({ weekStart, durationMin })` → `GET /availability`，`queryKey: ['availability', weekStart, durationMin]`，`staleTime: 30s`，切週時 `placeholderData: keepPreviousData` 避免閃爍；預先抓下一週（`queryClient.prefetchQuery`）。
- 上方工具列：上一週 / 本週 / 下一週按鈕、目前月份（跨月顯示「2026年10月–11月」）、服務時長選擇（60 / 90 or 120 分鐘，來自 `/services`）。上一週不能早於本週；下一週不能超過 `maxAdvanceDays`。
- **桌面（≥ 768px）**：`<table>`，第一欄是時段（例如 10:00–10:30），sticky 表頭與時段欄；週一到週日 7 欄。
- **手機（< 768px）**：上方 7 天橫向 chip（可左右滑，顯示「11/05 四」），下方只列出選中那天的時段清單（大按鈕，最少 44px 高）。不要在手機上塞 7 欄表格。
- 格子狀態樣式（同時用文字/圖示，不能只靠顏色）：
  - `available`：可點擊，主色外框，文字「可預約」；hover/focus 有明顯狀態。
  - `booked`：灰底，「已額滿」。
  - `closed`：斜線底紋（仿截圖的對角線格），顯示 `closedReason` 或「休息」。
  - `past` / `too_soon`：淡灰、不可點，`title` 說明「需於 3 天前預約」。
- 點擊 `available` → 開啟 `BookingForm`（MUI Dialog；手機用全螢幕 Dialog / bottom sheet），帶入開始時間與服務。
- 鍵盤：格子是 `<button>`，可 Tab；`aria-label="11月5日 星期四 10:00 可預約"`。
- 狀態：skeleton（表格灰塊）、錯誤（ErrorState + 重試按鈕）、整週無空檔（EmptyState：「本週已額滿，看看下一週」+ 按鈕）。
- 圖例（Legend）放在表格上方。

### `BookingForm.jsx`（取代三個重複的日曆元件與三個 Context）
- 欄位：服務、時長（價格即時顯示）、日期時間（唯讀，來自週曆）、Email（未登入才顯示）、備註（選填）。
- 用 `react-hook-form` + zod 做驗證（與後端 schema 規則一致）。
- 送出：`useCreateBooking()` mutation；成功 → `invalidateQueries(['availability'])`、`['me','bookings']`，顯示成功畫面（日期、項目、匯款說明、「加入 Google 日曆」連結）；`409 SLOT_TAKEN` → 提示「剛剛被別人預約了」並重新抓 availability、關閉 Dialog。
- 用同一個元件處理「會員預約」「訪客預約」「再次預約」，以是否登入切換，不再分三套。
- 確認畫面取代 SweetAlert2 的連續 alert；SweetAlert2 可整個移除。

### 營業時間預設值（待 Shack 確認，先放在 `settings/schedule` seed）
- 週二～週六 10:00–12:00、14:00–18:00、19:00–21:00；週日、週一休息。
- 時段 30 分鐘，buffer 30 分鐘，最少提前 3 天（沿用現有規則），最多預約 60 天內。

---

## 7. 前端 API 層規範

- `src/api/client.js`：
  - `baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'`。
  - 自動帶 `Authorization: Bearer <idToken>`（若已登入，`auth.currentUser.getIdToken()`）。
  - 非 2xx 時丟出 `ApiError { status, code, message, details }`。
  - 設定 timeout（AbortController，10s）。
- 每個資源一支檔案（`api/bookings.js` 等），只做 HTTP；React Query 邏輯放 `hooks/`。
- `lib/queryKeys.js` 集中管理 query key。
- 元件內**禁止**直接 `fetch(...)` 或寫死網址。
- 本機開發：`vite.config.js` 設 `server.proxy['/api'] → http://localhost:8080`，與正式環境同樣打相對路徑。
- 登入狀態用 Firebase `onAuthStateChanged` 包成 `AuthProvider`；**不在 localStorage 存密碼**；受保護路由用 `<RequireAuth>`。
- 移除 `console.log` 帳密、`window.alert`、未使用的套件（已確認 `moment`、`uuid`、`@reduxjs/toolkit`、`react-redux` 在 `src/` 沒有被 import；前端的 `dotenv` 也不需要；`@emailjs/browser` 改由後端寄信或保留但走 env）。
- `react-bootstrap` 目前約 15 個元件在用（`Container`/`Row`/`Col`/`Image`/`Button`）→ Phase 5 逐步改成 MUI `Container`/`Grid`/`Stack` 或 CSS Grid，全部替換後再移除 `bootstrap`、`react-bootstrap` 與 CDN。
- 路由改為 `/` 起始（Firebase Hosting 不需要 `/HumanDesign/` 前綴）；`React.lazy` 分割人類圖各分頁與預約頁，目標首屏 JS < 300 kB gzip 前。

---

## 8. RWD 與視覺規範

- 建立 `styles/tokens.css`：
  - 斷點只用三個：`sm 480px`、`md 768px`、`lg 1024px`（MUI theme 的 breakpoints 同步設定）。
  - 字型：在 `index.html` 用 Google Fonts 載入 `Noto Sans TC`（400/500/700），全站 `font-family: 'Noto Sans TC', system-ui, sans-serif`；標題可選 `Noto Serif TC` 但要一致。
  - 字級用 `clamp()`（例：h1 `clamp(1.75rem, 4vw, 3rem)`），內文 16px、行高 1.7。
  - 色彩：定義 `--color-primary / --color-surface / --color-text / --color-muted / --color-border`，對比至少 WCAG AA；目前紅字＋黑灰漸層的標題要改。
  - 間距：4/8/12/16/24/32/48/64；頁面左右 padding 手機 16px、桌面置中 `max-width: 1120px`。
- MUI 建立單一 `theme.js`（palette、typography、breakpoints、`shape.borderRadius`），把 react-bootstrap 版面元件換成 MUI 後移除 Bootstrap，避免兩套樣式衝突（Bootstrap 的全域 reset 目前會覆蓋部分 MUI 樣式）。
- 逐頁修正（在 375px、768px、1280px 三種寬度都要檢查，**不得有水平捲動**）：
  - Header：Logo 換成自有圖檔（`public/` 或 `src/assets/`）並加 alt，連回首頁；漢堡改 `<button aria-label="開啟選單" aria-expanded>`；手機選單全寬、可用 Esc 關閉；目前頁面高亮。
  - 首頁 hero：斜切背景改用 `clip-path` 或背景漸層，文字在色塊內、有 padding；移除與網站無關的 DW 新聞卡片與圖片。
  - 服務介紹／預約流程：CSS Grid `repeat(auto-fit, minmax(240px, 1fr))` 卡片，圖片 `aspect-ratio` 固定、`object-fit: cover`、`loading="lazy"`。
  - Jerome 頁：補 RWD（目前完全沒有 media query），時間軸手機改單欄。
  - 表單（登入/註冊/忘記密碼/預約）：寬度 `min(100%, 420px)`，密碼規則改成輸入框下方 helper text，錯誤只在 touched 後顯示（DateTimePicker 預設紅框要修掉）。
  - Footer：`Layout` 用 `min-height: 100dvh` + flex，Footer 貼底；手機版版權字級 14px；社群 icon 改 MUI icon 或自有 SVG。
  - 所有 hotlink 圖片下載替換為有授權的素材（或先放 placeholder，並在 README 註明），不再使用 picsum。
  - Loading 用 skeleton，錯誤與空資料都要有畫面。
- `index.html`：`lang="zh-Hant-TW"`、title「當八字遇見人類圖｜Jerome 人類圖解析預約」、meta description、OG tags、favicon 換掉 vite.svg；移除 `apis.google.com/js/api.js` 與 Bootstrap CDN。

---

## 9. 人類圖內容規範

內容在 `server/scripts/seed.js` 中維護（由現有 `Server/ForSubPage/*.js` 搬移）。依公開資料，修正以下錯誤：

- 人類圖（Human Design）由 Ra Uru Hu（本名 Alan Robert Krakower，加拿大人）於 1987 年在西班牙伊比薩島提出，融合西洋占星、易經、卡巴拉生命之樹、印度脈輪等概念。依出生日期、時間、地點產生「人類圖」。
- **五種類型**與策略：生產者（等待回應）、顯示生產者（等待回應，再告知）、投射者（等待邀請）、顯示者（告知）、反映者（等待月亮週期，約 28 天）。
  - 現有 `TalentHumanDesign` 第 4 項標題寫「天生作家的生產者」，內容卻是反映者 → 改標題為反映者。
  - 缺少「顯示生產者」→ 補上。
- **人生角色共 12 種**：1/3、1/4、2/4、2/5、3/5、3/6、4/6、4/1、5/1、5/2、6/2、6/3（現在只列 6 種，補齊或註明「以下列舉部分」）。
- **九大能量中心**：頭頂、邏輯（概念化）、喉嚨、G、意志力（心）、情緒（太陽神經叢）、直覺（脾）、薦骨、根部。
- **36 條通道、64 個閘門**；輪迴交叉由個性與設計的太陽/地球四個閘門組成。
- **內在權威**：情緒、薦骨、直覺、意志力（自我）、自我投射、無內在權威（環境/頭腦型投射者）、月循環（反映者）。
- 用語中立：刪除「具備扎實的科學基礎」「量子物理」「揭露你的基因密碼」這類科學宣稱，改為「一套自我探索的工具」；頁尾加一句「內容僅供自我探索參考，不構成醫療、心理或財務建議」。
- 人類圖介紹頁內部連結改成相對路由（`/human/types` 等），不能出現 `localhost`。路由 slug 改英文（`/human/types`、`/human/profiles`、`/human/authority`、`/human/centers`、`/human/channels`、`/human/cross`、`/human/origin`、`/human/overview`），頁面標題維持中文。
- 錯字修正：例如「人生腳色」→「人生角色」、「讓人活活得更自在」→「讓人活得更自在」、「不提地戰鬥」→「不停地戰鬥」、「較紹」→「介紹」。

---

## 10. 測試（JD 要求「單元測試」）

- 後端：`vitest` + `supertest`。
  - `availabilityService` 純函式：跨整點、跨日、120 分鐘方案 + buffer、休息日、`too_soon`、時區（UTC 伺服器算 Asia/Taipei 營業時間）。
  - `POST /bookings`：驗證失敗 400、時段衝突 409（用 Firestore Emulator 並發送兩個請求，只能成功一個）、訪客缺 email 400。
  - `DELETE /bookings/:id`：非本人 403、token 錯誤 403、24 小時內 422。
- 前端：`vitest` + `@testing-library/react` + `msw`。
  - `AvailabilityWeekGrid`：渲染各狀態、切換週、手機/桌面版（mock `matchMedia`）、點可預約格開啟表單、鍵盤操作。
  - `BookingForm`：驗證訊息、成功流程、409 流程。
  - `api/client.js`：錯誤轉換、帶 token。
- 指令：根目錄 `npm test` 跑前後端；CI 需要 Firestore Emulator（`firebase emulators:exec`）。

---

## 11. 部署（GCP）

1. Firebase 專案（同時是 GCP 專案），升級 Blaze、設定預算警示。
2. 啟用：Cloud Run、Artifact Registry、Cloud Build、Secret Manager、Firestore（Native mode）、Firebase Auth（Email/Password）。
3. Secret Manager：`GMAIL_USER`、`GMAIL_APP_PASSWORD`（新輪替後的值，由 Shack 自行輸入）。
4. 後端：`server/Dockerfile`（`node:20-slim`，`npm ci --omit=dev`，非 root，`CMD ["node","src/index.js"]`，監聽 `process.env.PORT`）。
   `gcloud run deploy humandesign-api --source server --region asia-east1 --allow-unauthenticated --set-secrets=...`
   Cloud Run 的 service account 給 `roles/datastore.user`、`roles/secretmanager.secretAccessor`；不用下載 JSON key（Cloud Run 內 `firebase-admin` 用預設憑證）。
5. `firebase.json`：
   ```json
   {
     "hosting": {
       "public": "web/dist",
       "ignore": ["firebase.json", "**/.*"],
       "rewrites": [
         { "source": "/api/**", "run": { "serviceId": "humandesign-api", "region": "asia-east1" } },
         { "source": "**", "destination": "/index.html" }
       ],
       "headers": [
         { "source": "/assets/**", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
       ]
     },
     "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
     "emulators": { "auth": { "port": 9099 }, "firestore": { "port": 8081 }, "hosting": { "port": 5000 } }
   }
   ```
6. 前端：`npm --prefix web run build && firebase deploy --only hosting,firestore`。
7. GitHub Actions `deploy.yml`：用 `google-github-actions/auth` + Workload Identity Federation；先部署 Cloud Run，再部署 Hosting。PR 用 Firebase Hosting preview channel（方便「公開 Review」）。
8. 部署後 smoke test：`/api/v1/health`、`/api/v1/availability`、首頁、重新整理子路由不 404。
9. 舊的 GitHub Pages workflow 與 Render 服務在新版穩定後再停用（由 Shack 決定時間）。

---

## 12. 工作階段（依序執行，每階段一個 branch + PR）

面試日 2026-11-04。**11/3 晚上前至少完成 Phase 0–3 並部署**，Phase 4 以後視時間進行。

| Phase | Branch | 內容 | 完成條件 |
|---|---|---|---|
| 0 | `chore/security-and-cleanup` | 移除所有寫死的憑證改 env、加 `.env.example`；刪 `dist/`、`.github/workfolws/`；README 骨架 | `grep` 找不到任何憑證值；build 通過 |
| 1 | `feat/api-v1` | 建 `server/` 新分層、Firestore repository、seed script、`/services`、`/content`、`/about`、`/feedback`、`/availability`、`/bookings`、`/me/bookings`、auth middleware、error handler、zod 驗證、後端測試 | Emulator 上全部測試通過；並發測試只成功一筆 |
| 2 | `feat/web-api-layer` | 前端搬到 `web/`、`api/` + `hooks/` + `AuthProvider`（Firebase Auth）、移除寫死網址與重複 Context | 元件中沒有任何 `fetch(` 或 `onrender.com` / `localhost` |
| 3 | `feat/availability-calendar` | `AvailabilityWeekGrid` + `BookingForm`、桌面/手機版、前端測試 | 375/768/1280 截圖正常；測試通過 |
| 4 | `chore/gcp-deploy` | Dockerfile、firebase.json、CI/CD、部署 | 正式網址可完整預約一次並收到信 |
| 5 | `style/rwd-polish` | tokens、theme、字型、各頁 RWD、移除無關內容與 hotlink 圖片、a11y | 三種寬度無水平捲動；Lighthouse Accessibility ≥ 90 |
| 6 | `content/human-design` | 依第 9 節修正內容與錯字 | Shack 審閱通過 |
| 7 | `docs/readme-portfolio` | README：架構圖、API 表、技術決策、「原版問題 → 改善」對照表、截圖/GIF | 可直接當面試講稿 |

> 若時間不夠，Phase 4（部署）優先於 Phase 5：面試官能點開的線上網站，比本機很漂亮的版本更有說服力。

---

## 13. Claude Code 協作規則

- 每次開始前：先讀本檔與相關檔案，**先說計畫再改**；跨多檔的大改動先列出檔案清單讓 Shack 確認。
- 小步提交：一個 commit 一件事，訊息用 Conventional Commits（`feat:`、`fix:`、`refactor:`、`test:`、`chore:`、`docs:`、`style:`）。
- 每個 PR 描述包含：做了什麼、為什麼、怎麼測、截圖（UI 改動必附 375px 與 1280px）。
- 提交前必跑：`npm run lint`、`npm test`、`npm run build`（前後端）。
- **不得**：提交 `.env`、憑證、`node_modules`、`dist`；使用 `git push --force` 到 `main`；刪除 Firestore 正式資料；自行輪替或填入任何密碼。
- 不確定的商業規則（價格、營業時間、取消規則）→ 停下來問 Shack，不要自己假設；預設值要在程式中標 `// TODO(shack): confirm`。
- 程式風格：ESLint + Prettier（2 spaces、單引號、分號）；React function component + hooks；檔名元件用 PascalCase、其他用 camelCase。
- 解釋改動時用繁體中文，並附上「面試時可以怎麼講」的一句話，幫助 Shack 準備面試。

### 常用指令（Phase 1 後生效）
```bash
# 前端
npm --prefix web install
npm --prefix web run dev          # http://localhost:5173（/api 代理到 8080）
npm --prefix web test
# 後端
npm --prefix server install
firebase emulators:start --only auth,firestore
npm --prefix server run seed      # 寫入 emulator
npm --prefix server run dev       # http://localhost:8080
npm --prefix server test
# 部署
gcloud run deploy humandesign-api --source server --region asia-east1
npm --prefix web run build && firebase deploy --only hosting
```

---

## 14. 待 Shack 確認

1. **時長與價格**：60 / 90 分鐘（後端資料）還是 60 / 120 分鐘（前端畫面）？各服務價格以哪份為準？
2. **營業時間與休息日**：第 6 節的預設值是否正確？
3. **付款**：維持「預約後三日內匯款」（狀態 `pending_payment`，人工改 `confirmed`），還是需要簡單的管理頁（可當 JD「內部工具」的展示）？
4. **訪客預約**是否保留？（建議保留，降低預約門檻）
5. 網站是否真的會給 Jerome 使用？若是，圖片、文字、Logo 需要他提供或授權。
