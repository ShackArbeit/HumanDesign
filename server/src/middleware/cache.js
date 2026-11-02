// 預約資料會一直變動，告訴瀏覽器不要快取
export const noStore = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
