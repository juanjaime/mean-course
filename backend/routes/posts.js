const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require ('multer');
const MIME_TYPE_MAP ={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid){
      error= null;
    }
    cb(error, "backend/images")
  },
  filename:(req,file,cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
});

router.post("/",multer({storage: storage}).single('image'),async(req,res,next)=>{
  const url = req.protocol + '://' + req.get('host');
  const post= new Post({
    title: req.body.title,
    content:req.body.content,
    imagepath: url+'/images/'+req.file.filename

  });
  const result = await post.save();
  console.log(result);
  res.status(201).json({
    message:'Post added succesfully',
    post:{
      id: result._id,
      ...result
    }
    });
});
router.put('/:id',multer({storage: storage}).single('image'), async(req,res)=>{
  let imagepath = req.body.imagepath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagepath=url+'/images/'+req.file.filename;
  }
  console.log(imagepath);
  const result=await Post.findByIdAndUpdate(req.params.id,{title:req.body.title,content:req.body.content, imagepath:imagepath},{new:true,runValidators:true});
  res.status(200).json(result);
});//
router.get('/',async(req,res,next)=>{
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  //console.log(pageSize);
  const currentPage = +req.query.page;
  //console.log(currentPage);
  const postQuery=Post.find();
  if( pageSize && currentPage){
    console.log(pageSize);
    console.log(currentPage);
    postQuery.skip(pageSize*(currentPage-1)).limit(pageSize);
    console.log(postQuery);
  }
  const posts = await postQuery;
  const postscount = await Post.count();
  res.status(200).json({
    message:'Posts fetched succesfully',
    posts:posts,
    postscount: postscount
  });
  console.log(posts);
});
router.delete("/:id",async(req,res,next)=>{
  const posts = await Post.findByIdAndDelete(req.params.id);
  res.status(201).json({message:`Post ${posts} Deleted`});
});
router.get("/:id",async(req,res,next)=>{
  const post = await Post.findById(req.params.id);
  if(!post) return res.status(400).send("The post does not exist");
  res.status(200).json(post);
});
module.exports=router;
