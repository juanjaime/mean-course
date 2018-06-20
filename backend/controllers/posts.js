const Post = require('../models/post');
const multer = require ('multer');
const auth = require('../middleware/check-auth');
const MIME_TYPE_MAP ={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

exports.createPost= async(req,res,next)=>{
  try {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagepath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    });

    const result = await post.save();

    res.status(201).json({
      message: 'Post added succesfully',
      post: {
        id: result._id,
        ...result
      }
    });
  }
  catch (e) {
    res.status(500).json({
      message:"Creating a post failed"
    })
  }
};
exports.updatePost=async(req,res)=>{
  try {
    let imagepath = req.body.imagepath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagepath = url + '/images/' + req.file.filename;
    }

    const result = await Post.updateOne({_id: req.params.id, creator: req.userData.userId}, {
      title: req.body.title,
      content: req.body.content,
      imagepath: imagepath,
      creator: req.userData.userId
    }, {new: true, runValidators: true});
    if (result.n > 0) {
      res.status(200).json(result);
    } else {
      return res.status(401).json({message: "not your post"});
    }
  }
  catch (e) {
    res.status(500).json({message:"Cannot update"});
  }
};
exports.getAllPosts= async(req,res,next)=>{
  try {
    const pageSize = +req.query.pagesize;

    const currentPage = +req.query.page;

    const postQuery = Post.find();
    if (pageSize && currentPage) {

      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);

    }
    const posts = await postQuery;
    const postscount = await Post.count();
    res.status(200).json({
      message: 'Posts fetched succesfully',
      posts: posts,
      postscount: postscount
    });
  }
  catch (e) {
    res.status(500).json({
      message:'Could not fetch messages'
    });
  }
};
exports.deletePost= async(req,res,next)=>{
  try {
    const result = await Post.deleteOne({_id: req.params.id, creator: req.userData.userId});
    if (result.n > 0) {
      res.status(200).json(result);
    } else {
      return res.status(401).json({message: "not your post"});
    }
  }
  catch (e) {
    res.status(500).json({
      message:'Could not delete messages'
    });
  }
};
exports.getSinglePost=async(req,res,next)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send("The post does not exist");
    res.status(200).json(post);
  }
  catch (e) {
    res.status(500).json({
      message:'Could not fetch messages'
    });
  }
};
