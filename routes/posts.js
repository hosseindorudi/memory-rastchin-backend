const express = require("express");

const auth = require("../middleware/auth.js");
const postOwner = require("../middleware/postOwner.js");

const {
  getPosts,
  getPostsBySearch,
  getPostsByCreator,
  getPost,
  createPost,
  updatePost,
  likePost,
  commentPost,
  deletePost,
} = require("../controllers/posts.js");

const router = express.Router();

router.get("/creator", getPostsByCreator);
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", auth, createPost);
router.patch("/:id", auth, postOwner, updatePost);
router.delete("/:id", auth, postOwner, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", commentPost);

module.exports = router;
