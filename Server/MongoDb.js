const express = require('express');
const mongodb = require('mongodb');

const connectString = 'mongodb+srv://wang8119:wang8119@cluster0.w3kipgk.mongodb.net/?retryWrites=true&w=majority';

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(connectString);
const dbName = 'HumanDesign';
const collectionName = 'ForBooking';

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas', err);
  }
}


async function insertData(data) {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(data);
    return result;
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err;
  }
}


module.exports = { connect ,insertData};

connect();
