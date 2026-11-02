import { unauthenticated } from '../lib/errors.js';
import { auth } from '../lib/firebase.js';

// 從 Authorization 標頭取出 Bearer token
const readBearerToken = (req) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  return scheme === 'Bearer' ? token : null;
};

// 請 Firebase 驗證 token 是否有效
const verify = async (token) => {
  try {
    const { uid, email } = await auth().verifyIdToken(token);
    return { uid, email };
  } catch {
    throw unauthenticated('登入狀態已失效，請重新登入');
  }
};

// 登入是選用的：沒帶 token 視為訪客，帶了錯誤的 token 則拒絕。
// 這樣登入過期的會員不會被誤當成訪客預約
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = readBearerToken(req);
    if (!token) throw unauthenticated('登入狀態已失效，請重新登入');
    req.user = await verify(token);
  }
  next();
};

// 一定要登入才能繼續
export const requireAuth = async (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) throw unauthenticated();
  req.user = await verify(token);
  next();
};
