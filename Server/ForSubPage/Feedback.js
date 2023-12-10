
const router = require('express').Router();
const jdContent=[
      {id:1,title:'Jerome的人類圖分析師之路',content:'聽聽Jerome開始接觸到人類圖的契機，自己生命轉化的心路歷程以及成為人類圖分析師的初衷',url:'https://youtu.be/rkgEqVzYbzY?si=hjlNYqFwerjcsOu9'},
      {id:2,title:'職場引導師Kevin的人類圖實驗室',content:'聽聽一個平凡上班族的內心困頓掙扎，從香港離職移居台灣的心路歷程以及迎接人生有無限可能。',url:'https://youtu.be/oA3wmT2sP-s?si=wST31wFSlRDpp_Gh'},
      {id:3,title:'簡單一句，人類圖是什麼？',content:'人生到底是命運固定論，還是演化成長論？快速導覽「類型、人生角色、能量中心、通道、閘門、輪迴交叉、內在權威與行動策略」',url:'https://youtu.be/rS4RzYxEQyI?si=zpihC_yuWwiQqHt1'},
      {id:4,title:'為什麼我需要人類圖解讀？',content:'五種解讀：1.個人本命圖解讀，2.關係合圖解讀，3.輪迴交叉解讀，4.三種大流年解讀，5.每年度流年解讀。如何找到適合自己的分析師？',url:'https://youtu.be/xH4zzVUJL-I?si=Vu2apLh6lHhs3Cf_'}
]
router.get('/feedback/jdShare',(req,res)=>{
      res.send(jdContent)
})
module.exports=router