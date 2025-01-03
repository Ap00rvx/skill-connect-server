const Post = require('../models/post.model');
const User = require('../models/user.model');

const createPost = async (req, res) => {
    const {title, description, category,budget,attachments,location,deadline} = req.body ;
    const user = req.user;
    
    if (!title || !description || !category) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const newPost = new Post({ title, description, category,budget,attachments,location,deadline,user: user._id });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const searchPosts = async (req, res) => {
    const { query } = req.body;
    try {
        const posts = await Post.find({ $text: { $search: query } });
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description, category,budget,attachments,location,deadline } = req.body;
    try {
        const post = await Post.findByIdAndUpdate(id, { title, description, category,budget,attachments,location,deadline }, { new: true });
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const respondToPost = async (req, res) => {
    const { id } = req.params;
    const { message, proposedBudget } = req.body;
    const teacher = req.user;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({ message: 'Post does not exist' });
        }
        post.responses.push({ teacher: teacher._id, message, proposedBudget });
        await post.save();
        res.json({ message: 'Response sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getResponses = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('responses.teacher');
        if (!post) {
            return res.status(400).json({ message: 'Post does not exist' });
        }
        res.json(post.responses);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getPostsByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const posts = await Post.find({ user: id });
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

const getPostsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const posts = await Post.find ({ category });
        return res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostsByCategory,
    searchPosts,
    getPost,
    updatePost,
    deletePost,
    respondToPost,
    getResponses,
    getPostsByUser
};
