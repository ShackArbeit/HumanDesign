const mongoose =require('mongoose');

let isConnected = false; 
const url = "mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority"

const connectToDB = async () => {
  mongoose.set('strictQuery', true);
  if(isConnected) {
    console.log('已經連線到 MongoDB 了 !');
    return;
  }
  try {
    await mongoose.connect(url, {
      dbName: "myWebsite",
    })
    isConnected = true;
    console.log('你已經成功連線了 !')
  } catch (error) {
    console.log('連線失敗',error);
  }
}
module.exports=connectToDB