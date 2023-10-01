import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors())

const userLevel1=[
      {id:4,job:'police',salary:1000},
      {id:5,job:'doctor',salary:2000},
      {id:6,job:'lawer',salary:3000},
]

app.get("/", (req , res) => {
    res.send( "Hello world!" );
});
app.get('/user',(req,res)=>{
      res.send(userLevel1)
})

app.listen(8000,()=>{
      console.log('Server running at port 8000 !')
})