import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPost= async (req,res)=>{
   try{
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
   }
   catch(error){
    res.status(404).json({message:error.message});
   }
};

export const createPost= async (req,res)=> {
    const post = req.body;
    const newPost = new PostMessage({... post,creator:req.userId,createdAt:new Date().toISOString()});
    try {
       await newPost.save();
    res.status(201).json(newPost);

    } catch (error) {
    res.status(409).json({message:error.message});
        
    }
}


export const updatePost = async (req,res)=>{
   const {id:_id} = req.params;
   const post = req.body;
   if(mongoose.Types.ObjectId.isValid(_id)){
      
     const updatedPost= await PostMessage.findByIdAndUpdate(_id,{... post,_id},{new:true})
     res.json(updatedPost);
   }
   else{
      return res.status(404).send('No post with that id')
   }
}

export const deletePost = async(req,res)=>{
   const {id:_id} = req.params;
   if(mongoose.Types.ObjectId.isValid(_id)){
      
     await PostMessage.findByIdAndDelete(_id)
     res.json("DELETED");
   }
   else{
      return res.status(404).send('No post with that id')
   }

}

export const likePost = async (req,res)=>{
   const {id:_id} = req.params;
   if(mongoose.Types.ObjectId.isValid(_id)){
      if(!req.userId) return res.json({message: "Unauthenticated"});
     const post= await PostMessage.findById(_id);
     const index = post.likes.findIndex((id)=>id==String(req.userId));
     if(index == -1){
      post.likes.push(req.userId);
        const updatePost = await PostMessage.findByIdAndUpdate(_id,{likeCount:post.likeCount +1},{new:true});
        res.json(post);
      }
      else{
      post.likes = post.likes.filter((id)=> id!= String(req.userId));

      
   }
   const updatePost = await PostMessage.findByIdAndUpdate(_id,post,{new:true});
   res.json(post);
   }
   else{
      return res.status(404).send('No post with that id')
   }
}
