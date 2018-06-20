const mongoose =require('mongoose');
const postSchema =  mongoose.Schema({
  title: {
    type:String,
    required:"This field is required"
  },
  content: {
    type: String,
    required: true
  },
  imagepath:{
    type:String,
    required: true
  },
  creator:{
    type: mongoose.Schema.Types.ObjectId, ref:"User",required: true
  }
});
module.exports=mongoose.model('Post',postSchema);
