const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
router.post("/signup",async (req,res,next) =>{
  const password = await bcrypt.hash(req.body.password, 10);
  const user= new User({
    email: req.body.email,
    password: password
  });
  try {
    await user.save();
    res.status(201).json({
      message: "user created",
      result: user
    });
  }
  catch (e) {
    console.log(e);
    res.status(500).json({
      message:`Something is wrong with the email, maybe you registered before...`
    })
  }
});
router.post("/login",async(req,res,next)=>{
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).json({
      message: 'Auth failed'
    });
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(401).json({
      message: 'Auth failed'
    });
    const token = jwt.sign({
      email: user.email,
      userId: user._id
    }, 'secret_this_should_be_longer', {
      expiresIn: '1h',
    });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    })
  }
  catch (e) {
    return res.status(401).json({message: "your login credentials are not valid"});

  }
});
module.exports=router;
