const router = require('express').Router();
const isDesktopContent=[
    {id:1,title:'個人解析',content:'個人解析是讓你知道自己是屬於何種類型，以了解並應用自己的人生策略，讓人活活得更自在。',
    urlOne:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5c383bea38f68-923333400-1547189226.png',urlTwo:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5ec6355532914-920713800-1590048085.jpg',
    price60:5000,price90:9000},
    {id:2,title:'多人解析',content:'多人解析是讓你與你的伴侶知道彼此的類型並找出最佳的互動策略。',urlOne:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5c383beaab657-970205300-1547189226.png',
     urlTwo:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5ec63fb8c6fdc-981508300-1590050744.jpg',
     price60:7000,price90:12000},
     {id:3,title:'親子解析',content:'親子解析是讓你與孩子知道彼此是屬於何種類型，找出與孩子最佳的互動模式。',urlOne:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5c383be9c3956-980112600-1547189225.png',
     urlTwo:'https://sb-drops.s3.amazonaws.com/drop/rmopt-6441101e9984e-962881900-1681985566.png',
     price60:8000,price90:14000},
     {id:4,title:'團體解析',content:'團體解析是讓一團體知道彼此的最佳互動策略，以促進團體成長。',urlOne:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5c383bea38f68-923333400-1547189226.png',
     urlTwo:'https://sb-cafetalk.s3.amazonaws.com/user-uploaded-files/cafetalk-optimized-5dc3c0c808254-903338000-1573109960.jpg',
     price60:9000,price90:15000},
]

const isMobile=[
    {id:1,title:'個人解析',content:'個人解析是讓你知道自己是屬於何種類型，以了解並應用自己的人生策略，讓人活活得更自在。',
    url:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5ec6355532914-920713800-1590048085.jpg',
    price60:5000,price90:9000},
    {id:2,title:'多人解析',content:'多人解析是讓你與你的伴侶知道彼此的類型並找出最佳的互動策略。',
     url:'https://sb-drops.s3.amazonaws.com/drop/rmopt-5ec63fb8c6fdc-981508300-1590050744.jpg',
     price60:7000,price90:12000},
     {id:3,title:'親子解析',content:'親子解析是讓你與孩子知道彼此是屬於何種類型，找出與孩子最佳的互動模式。',
     url:'https://sb-drops.s3.amazonaws.com/drop/rmopt-6441101e9984e-962881900-1681985566.png',
     price60:8000,price90:14000},
     {id:4,title:'團體解析',content:'團體解析是讓一團體知道彼此的最佳互動策略，以促進團體成長。',
     url:'https://sb-cafetalk.s3.amazonaws.com/user-uploaded-files/cafetalk-optimized-5dc3c0c808254-903338000-1573109960.jpg',
     price60:9000,price90:15000},
]


router.get('/bookingIntroduction/isDesktop',(req,res)=>{
    res.send(isDesktopContent)
   })
router.get('/bookingIntroduction/isMobile',(req,res)=>{
     res.send(isMobile)
  })

module.exports=router