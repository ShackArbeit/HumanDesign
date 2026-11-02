// 集中管理 React Query 的 key，避免各檔案打錯字
export const queryKeys = {
  availability: (weekStart, durationMin) => ['availability', weekStart, durationMin],
  availabilityAll: ['availability'],
  myBookings: ['me', 'bookings'],
};
