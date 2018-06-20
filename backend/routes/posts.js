const express = require('express');
const router = express.Router();
const auth = require('../middleware/check-auth');
const extractFile = require('../middleware/images');

const {createPost,updatePost,getAllPosts,deletePost,getSinglePost}=require('../controllers/posts');

router.post("/",auth,extractFile,createPost);
router.put('/:id',auth,extractFile, updatePost);//
router.get('/',getAllPosts);
router.delete("/:id",auth,deletePost);
router.get("/:id",getSinglePost);
module.exports=router;
