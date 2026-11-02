const options = (price60, price120) => [
  { durationMin: 60, priceTwd: price60 },
  { durationMin: 120, priceTwd: price120 },
];

// 服務與價格的顯示資料。實際收費以 server/src/config/services.js 為準，
// 修改價格時兩邊都要改。imagePath 是假圖片。
// TODO(shack): 確認各服務價格。
export const services = [
  {
    id: 'personal',
    name: '個人解析',
    description: '個人解析是讓你知道自己是屬於何種類型，以了解並應用自己的人生策略，讓人活得更自在。',
    options: options(5000, 9000),
    imagePath: 'https://picsum.photos/seed/humandesign-service-personal/800/450',
  },
  {
    id: 'multi-person',
    name: '多人解析',
    description: '多人解析是讓你與你的伴侶知道彼此的類型並找出最佳的互動策略。',
    options: options(7000, 12000),
    imagePath: 'https://picsum.photos/seed/humandesign-service-multi-person/800/450',
  },
  {
    id: 'family',
    name: '親子解析',
    description: '親子解析是讓你與孩子知道彼此是屬於何種類型，找出與孩子最佳的互動模式。',
    options: options(8000, 14000),
    imagePath: 'https://picsum.photos/seed/humandesign-service-family/800/450',
  },
  {
    id: 'group',
    name: '團體解析',
    description: '團體解析是讓一團體知道彼此的最佳互動策略，以促進團體成長。',
    options: options(9000, 15000),
    imagePath: 'https://picsum.photos/seed/humandesign-service-group/800/450',
  },
];
