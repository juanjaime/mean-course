const express = require('express');
const app = express();
const mongoose=require("mongoose");
const postsRoutes =require('./routes/posts');
const usersRoutes= require('./routes/users');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images',express.static(path.join('backend/images')));
mongoose.connect('mongodb+srv://juan:'+process.env.MONGO_ATLAS_PW+'@cluster0-zqvtj.mongodb.net/test').then(()=>{
  console.log("Connected to database")
}).catch(()=>{
  console.log("Cannot connect to the database");
});
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next()
});
//Mongo Password : JLE88XVSv09BO52S
app.use('/api/posts',postsRoutes);
app.use('/api/users',usersRoutes);


module.exports = app;
