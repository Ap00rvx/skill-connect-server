const {createPost,
    getPosts,
    getPostsByCategory,
    searchPosts,
    getPost,
    updatePost,
    deletePost,
    respondToPost,
    getResponses,
    getPostsByUser} = require("../controllers/post.controller");
const express = require("express");
const userMiddleware = require("../middlewares/user.middleware");

const router = express.Router();

router.post("/create", userMiddleware,createPost);
router.get("/", getPosts);
router.get("/:category", getPostsByCategory);
router.get("/search/:query", searchPosts);
router.get("/post/:id", getPost);
router.put("/update/:id", userMiddleware,updatePost);
router.delete("/delete/:id", userMiddleware,deletePost);
router.post("/respond/:id", userMiddleware,respondToPost);
router.get("/responses/:id", getResponses);
router.get("/user/:id", getPostsByUser);



module.exports = router;

