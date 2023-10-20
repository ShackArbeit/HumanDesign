const express=require('express')
const cors=require('cors')
const JeromeProfile=require('./AboutJerome');
const jdContent=require('./Feedback');
const {hoverHumanDesign}=require('./WhatIsHumanDesign')
const {serviceContent}=require('./HomePage')
const {bookingProcess}=require('./HomePage')
const {explainHumanDesign}=require('./WhatIsHumanDesign')
const {TalentHumanDesign}=require('./WhatIsHumanDesign')
const { roleHumanDesign}=require('./WhatIsHumanDesign')
const {authorHumanDesign}=require('./WhatIsHumanDesign')
const {energyHumanDesign}=require('./WhatIsHumanDesign')
const app = express();
const corsOptions = {
  origin: 'https://shackarbeit.github.io/HumanDesign/Jerome',
};

app.use(cors(corsOptions));

app.use(cors())

app.get("/", (req , res) => {
    res.send( "Hello world!" );
});
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
app.get('/home/service',(req,res)=>{
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
app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})