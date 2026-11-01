# 當八字遇見人類圖｜Jerome 人類圖解析預約

人類圖解析服務的介紹與線上預約網站。專案正在改版，規劃與進度見 [CLAUDE.md](./CLAUDE.md)。

> 內容僅供自我探索參考，不構成醫療、心理或財務建議。

## 功能

待補

## 架構

待補

## 本機開發

```bash
# 前端
cp web/.env.example web/.env.local
npm --prefix web install
npm --prefix web run dev          # http://localhost:5173（/api 代理到 8080）
npm --prefix web test

# 後端（需要 Firebase CLI 與 Java）
cp server/.env.example server/.env
npm --prefix server install
firebase emulators:start --only auth,firestore --project demo-humandesign
npm --prefix server run seed      # 另開終端機，寫入 emulator
npm --prefix server run dev       # http://localhost:8080
npm --prefix server test          # 自動啟動 emulator 並跑全部測試
```

環境變數的項目見 `web/.env.example` 與 `server/.env.example`，實際的值不可提交到版本控制。

## 技術決策

待補

## 原版問題與改善對照

待補
