const express=require('express')
const cors=require('cors')
const JeromeProfile=require('./AboutJerome');
const jdContent=require('./Feedback')
const serviceContent=require('./HomePage')

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
app.get('/feedback/jdShare',(req,res)=>{
  res.send(jdContent)
})
app.get('/home/service',(req,res)=>{
  res.send(serviceContent)
})
app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})