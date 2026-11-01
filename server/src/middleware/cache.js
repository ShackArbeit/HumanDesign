export const publicCache = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
};

export const noStore = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
