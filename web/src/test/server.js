import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const API = 'http://localhost/api/v1';

export const services = [
  {
    id: 'personal',
    name: '個人解析',
    description: '',
    imagePath: null,
    options: [
      { durationMin: 60, priceTwd: 5000 },
      { durationMin: 120, priceTwd: 9000 },
    ],
  },
  {
    id: 'family',
    name: '親子解析',
    description: '',
    imagePath: null,
    options: [
      { durationMin: 60, priceTwd: 8000 },
      { durationMin: 120, priceTwd: 14000 },
    ],
  },
];

const slot = (date, utcHour, status) => ({
  start: `${date}T${utcHour}:00:00Z`,
  end: `${date}T${utcHour}:30:00Z`,
  status,
});

// Monday to Sunday starting from `from`, with one row per status on the Tuesday.
export const buildWeek = (from, overrides = {}) => {
  const start = new Date(`${from}T00:00:00Z`);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10);
    return {
      date,
      weekday: (index + 1) % 7,
      closedReason: null,
      slots: [slot(date, '02', 'closed'), slot(date, '03', 'closed'), slot(date, '04', 'closed')],
    };
  });
  days[1].slots = [
    slot(days[1].date, '02', 'available'),
    slot(days[1].date, '03', 'booked'),
    slot(days[1].date, '04', 'too_soon'),
  ];
  days[2].closedReason = '國定假日休息';
  return { timezone: 'Asia/Taipei', slotMinutes: 30, maxAdvanceDays: 60, days, ...overrides };
};

export const handlers = [
  http.get(`${API}/services`, () => HttpResponse.json({ data: services })),
  http.get(`${API}/availability`, ({ request }) => {
    const from = new URL(request.url).searchParams.get('from');
    return HttpResponse.json({ data: buildWeek(from) });
  }),
];

export const server = setupServer(...handlers);
