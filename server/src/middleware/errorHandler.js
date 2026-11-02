import { AppError, notFound } from '../lib/errors.js';

// 找不到路由時回傳 404
export const notFoundHandler = (req, res, next) => next(notFound());

// Express 靠「四個參數」判斷這是錯誤處理函式，所以 next 不能省略
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
export const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: { code: error.code, message: error.message, details: error.details },
    });
  }
  if (error.type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ error: { code: 'VALIDATION_ERROR', message: '請求格式錯誤' } });
  }
  console.error(
    JSON.stringify({
      severity: 'ERROR',
      message: error.message,
      stack: error.stack,
      path: req.path,
    }),
  );
  return res.status(500).json({ error: { code: 'INTERNAL', message: '伺服器發生錯誤' } });
};
