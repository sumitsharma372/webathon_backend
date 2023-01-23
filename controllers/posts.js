import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find({title});

        res.json({data: posts})
        
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    try {
        await newPost.save();

        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with that id')
    }
    const updateddPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true})

    res.json(updateddPost)
}

export const deletePost = async(req, res) => {
    const { id: _id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with that id')
    }

    await PostMessage.findByIdAndDelete(_id)
    res.json({message: 'Post deleted successfully'})
}

export const likePost = async(req, res) => {
    const { id } = req.params;
    const { name } = req.query;

    // console.log(name)

    if(!req.userId) return res.json({ message: 'Unauthorized'});

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id')
    }

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex(id => id === `${req.userId} ${name}`); 

    if(index === -1) {
        // like the post
        post.likes.push(`${req.userId} ${name}`)
    }else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== `${req.userId} ${name}`)
    }

    post.approvedMembers.map(member => {
        if (!post.likes.includes(member)){
            post.approvedMembers = post.approvedMembers.filter(i => i !== member)
        }
    })

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatedPost)
}


export const deleteVote = async (req, res) => {
    const { id } = req.params;
    const { vote } = req.query;
    console.log(vote)

    if(!req.userId) return res.json({ message: 'Unauthorized'});

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id')
    }

    const post = await PostMessage.findById(id);

    post.likes = post.likes.filter((id) => id !== String(vote))

    console.log(post.likes)

    post.approvedMembers.map(member => {
        if (!post.likes.includes(member)){
            post.approvedMembers = post.approvedMembers.filter(i => i !== member)
        }
    })

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    console.log(updatedPost)
    res.json(updatedPost)
}

export const approveMember = async (req, res) => {
    const { id } = req.params;
    const { vote } = req.query;

    console.log(vote)

    if(!req.userId) return res.json({ message: 'Unauthorized'});

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id')
    }

    const post = await PostMessage.findById(id);

    const index = post.approvedMembers.findIndex(id => id === vote);
    
    if(index === -1) {
        // like the post
        post.approvedMembers.push(vote)
    }else {
        // dislike a post
        post.approvedMembers = post.likes.filter((id) => id !== vote)
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    console.log(updatedPost)

    res.json(updatedPost)
}
