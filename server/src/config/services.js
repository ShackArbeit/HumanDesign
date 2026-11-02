// 後端自己保留一份服務價格。
// 預約金額一定要由後端決定，不能相信瀏覽器傳來的數字。
// 修改價格時，也要同步修改 web/src/data/services.js 的顯示資料。
// TODO(shack): 確認各服務價格。
const services = [
  {
    id: 'personal',
    name: '個人解析',
    options: [
      { durationMin: 60, priceTwd: 5000 },
      { durationMin: 120, priceTwd: 9000 },
    ],
  },
  {
    id: 'multi-person',
    name: '多人解析',
    options: [
      { durationMin: 60, priceTwd: 7000 },
      { durationMin: 120, priceTwd: 12000 },
    ],
  },
  {
    id: 'family',
    name: '親子解析',
    options: [
      { durationMin: 60, priceTwd: 8000 },
      { durationMin: 120, priceTwd: 14000 },
    ],
  },
  {
    id: 'group',
    name: '團體解析',
    options: [
      { durationMin: 60, priceTwd: 9000 },
      { durationMin: 120, priceTwd: 15000 },
    ],
  },
];

// 用 id 找服務，找不到時回傳 null
export function findService(id) {
  for (const service of services) {
    if (service.id === id) {
      return service;
    }
  }
  return null;
}
