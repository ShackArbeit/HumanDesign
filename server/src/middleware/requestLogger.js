// Structured JSON for Cloud Logging. Only the pathname is logged because guest
// cancel tokens travel in the query string.
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
