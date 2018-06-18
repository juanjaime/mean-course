const express = require('express');
const app = express();
const mongoose=require("mongoose");
const postsRoutes =require('./routes/posts');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images',express.static(path.join('backend/images')));
mongoose.connect('mongodb+srv://juan:JLE88XVSv09BO52S@cluster0-zqvtj.mongodb.net/test?retryWrites=true').then(()=>{
  console.log("Connected to database")
}).catch(()=>{
  console.log("Cannot connect to the database");
});
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept");
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next()
});
//Mongo Password : JLE88XVSv09BO52S
app.use('/api/posts',postsRoutes);

module.exports = app;
