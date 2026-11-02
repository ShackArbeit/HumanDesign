// 後端程式的進入點：讀取環境變數、建立 app、開始監聽
import 'dotenv/config';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { createMailService } from './lib/mail.js';

const env = loadEnv();

const app = createApp({
  mail: createMailService({ user: env.GMAIL_USER, password: env.GMAIL_APP_PASSWORD }),
  webBaseUrl: env.WEB_BASE_URL,
  trustProxyHops: env.TRUST_PROXY_HOPS,
});

app.listen(env.PORT, () => {
  console.log(JSON.stringify({ severity: 'INFO', message: `Listening on ${env.PORT}` }));
});
