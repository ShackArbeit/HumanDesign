// 用 JSON 格式記錄每個請求，方便在 Cloud Logging 查詢。
// 只記錄路徑、不記錄查詢字串，因為訪客的取消 token 會放在查詢字串裡
export const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.log(
      JSON.stringify({
        severity: res.statusCode >= 500 ? 'ERROR' : 'INFO',
        message: 'request',
        method: req.method,
        path: req.originalUrl.split('?')[0],
        status: res.statusCode,
        latencyMs: Date.now() - startedAt,
      }),
    );
  });
  next();
};
