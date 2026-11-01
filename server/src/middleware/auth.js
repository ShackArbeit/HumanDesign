import { unauthenticated } from '../lib/errors.js';
import { auth } from '../lib/firebase.js';

const readBearerToken = (req) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  return scheme === 'Bearer' ? token : null;
};

const verify = async (token) => {
  try {
    const { uid, email } = await auth().verifyIdToken(token);
    return { uid, email };
  } catch {
    throw unauthenticated('登入狀態已失效，請重新登入');
  }
};

// A bad token is rejected rather than treated as a guest, so an expired session
// cannot silently create a booking outside the member account.
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = readBearerToken(req);
    if (!token) throw unauthenticated('登入狀態已失效，請重新登入');
    req.user = await verify(token);
  }
  next();
};

export const requireAuth = async (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) throw unauthenticated();
  req.user = await verify(token);
  next();
};
