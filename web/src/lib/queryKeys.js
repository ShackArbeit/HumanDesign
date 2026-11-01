export const queryKeys = {
  services: ['services'],
  content: (section) => ['content', section],
  aboutTimeline: ['about', 'timeline'],
  feedbackVideos: ['feedback', 'videos'],
  availability: (weekStart, durationMin) => ['availability', weekStart, durationMin],
  availabilityAll: ['availability'],
  myBookings: ['me', 'bookings'],
};
