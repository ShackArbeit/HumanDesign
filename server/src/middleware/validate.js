// 用 zod 檢查請求資料，通過後放進 req.validated，不通過就回傳 400
import { AppError } from '../lib/errors.js';

export const validate = (schemas) => (req, res, next) => {
  req.validated = {};
  for (const [source, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      throw new AppError(400, 'VALIDATION_ERROR', '輸入資料有誤', details);
    }
    req.validated[source] = result.data;
  }
  next();
};
