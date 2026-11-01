const mongoose =require('mongoose');
const requireEnv = require('../config/requireEnv');

let isConnected = false; 
const url = requireEnv('MONGODB_URI')

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