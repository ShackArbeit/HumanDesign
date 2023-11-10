const express=require('express')
const JeromeProfile=require('./AboutJerome');
const jdContent=require('./Feedback');
const { serviceContent}=require('./HomePage');
const {bookingProcess}=require('./HomePage')
const {hoverHumanDesign}=require('./WhatIsHumanDesign')
const {explainHumanDesign}=require('./WhatIsHumanDesign')
const {TalentHumanDesign}=require('./WhatIsHumanDesign')
const { roleHumanDesign}=require('./WhatIsHumanDesign')
const {authorHumanDesign}=require('./WhatIsHumanDesign')
const {energyHumanDesign}=require('./WhatIsHumanDesign')
const {roadHumanDesign}=require('./WhatIsHumanDesign')
const { writerHumanDesign} =require('./WhatIsHumanDesign')
const {isDesktopContent}=require('./BookingIntroduction')
const cors = require('cors');
const {isMobile}=require('./BookingIntroduction')


const mongo = require('mongodb')
const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"
const client = new mongo.MongoClient(url);
let db = null
async function initDB() {
      try {
            await client.connect()
            console.log('連線成功')
            db = client.db("myWebsite");
  
      } catch (err) {
            console.log('連線失敗', err)
            return
      }
}
initDB()




const app = express();
app.use(cors());
app.use(express.json())



app.get("/", (req , res) => {
    res.send( "Hello world!" );
});

// 關於連接到 MongoDB 的路由設定 
app.post('/saveDateTime', async (req, res) => {
  try {
    const collection = db.collection('ForBooking');
    const { selectDateTime } = req.body;
    const newBooking=new Date(selectDateTime)
    const year=newBooking.getFullYear();
    const month=newBooking.getMonth();
    const day=newBooking.getDate();
    const hour=newBooking.getHours();
    const minute=newBooking.getMinutes();
    let Booking = await collection.findOne({ 
      Year:year,
      Month:month,
      Day:day,
      Hour:hour,
      Minute:{$gt: 8.5}}
     });
    if (Booking) {
      res.json({ success: false, message: 'DateTime already exists!' });
    } else {
        Booking = await collection.insertOne({ 
        Year:year,
        Month:month,
        Day:day,
        Hour:hour,
        Minute:minute });
      res.json({ success: true, message: 'DateTime inserted successfully!' });
    }
  } catch (error) {
    console.error('Error inserting DateTime into MongoDB:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
})





// 關於 Jerome 分頁
app.get('/aboutJerome/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const profile=JeromeProfile.find(item=>item.id===id)
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }else{
  res.json({id:profile.id,title:profile.title,content:profile.content});
  }
});
// 觀眾回饋
app.get('/feedback/jdShare',(req,res)=>{
  res.send(jdContent)
})
//首頁解析項目區塊
app.get('/home/serviceProcess',(req,res)=>{
  res.send(serviceContent)
})
// 首頁預約流程區塊
app.get('/home/bookingProcess',(req,res)=>{
  res.send(bookingProcess)
})
// 人類圖是什麼分頁
app.get('/human/hoverIntroducer',(req,res)=>{
  res.send(hoverHumanDesign)
})
// 人類圖較紹子分頁 1 (簡介)
app.get('/human/explainHuman',(req,res)=>{
  res.send(explainHumanDesign)
})
// 人類圖較紹子分頁 2 (類型與天賦)
app.get('/human/talentHuman',(req,res)=>{
  res.send(TalentHumanDesign)
})
// 人類圖較紹子分頁 3 (角色部分)
app.get('/human/roleHuman',(req,res)=>{
  res.send(roleHumanDesign)
})
// 人類圖介紹分頁 4 (內在權威部分)
app.get('/human/authorHuman',(req,res)=>{
  res.send(authorHumanDesign)
})
// 九大中心
app.get('/human/energyHuman',(req,res)=>{
  res.send(energyHumanDesign)
})
// 作者部分
app.get('/human/writerHuman',(req,res)=>{
  res.send( writerHumanDesign)
})
// 通道部分
app.get('/human/roadHuman',(req,res)=>{
  res.send(roadHumanDesign)
})
// 以下為預約系統的部分
app.get('/bookingIntroduction/isDesktop',(req,res)=>{
  res.send(isDesktopContent)
})
app.get('/bookingIntroduction/isMobile',(req,res)=>{
  res.send(isMobile)
})

// 以下為將所選取的日期及時間放進資料庫的路由
app.post('/saveDateTime',async (req,res)=>{
     try{
      const collection=db.collection('ForBooking')
      const { selectDateTime } = req.body;
      let result = await collection.findOne({ dateTime: selectDateTime });
      if (result) {
        // If dateTime already exists, you might want to handle this case accordingly
        res.json({ success: false, message: 'DateTime already exists!' });
      } else {
        // Insert the dateTime into the MongoDB collection
        result = await collection.insertOne({ dateTime: selectDateTime });
        res.json({ success: true, message: 'DateTime inserted successfully!' });
      }
     }catch(error){
      console.error('Error inserting DateTime into MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
     }
)



app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})