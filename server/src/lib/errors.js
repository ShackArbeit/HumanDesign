// API 使用的錯誤類別，以及常用錯誤的建立函式
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (message = '找不到資源') => new AppError(404, 'NOT_FOUND', message);
export const forbidden = (message = '沒有權限執行此操作') =>
  new AppError(403, 'FORBIDDEN', message);
export const unauthenticated = (message = '請先登入') =>
  new AppError(401, 'UNAUTHENTICATED', message);
export const slotTaken = () => new AppError(409, 'SLOT_TAKEN', '此時段已被預約');
