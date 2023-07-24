import express from "express";

import {
  getPosts,
  getPostsBySearch,
  getPostsByCreator,
  getPost,
  createPost,
  updatePost,
  likePost,
  commentPost,
  deletePost,
} from "../controllers/posts.js";

const router = express.Router();
import auth from "../middleware/auth.js";
import postOwner from "../middleware/postowner.js";

router.get("/creator", getPostsByCreator);
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", auth, createPost);
router.patch("/:id", auth, postOwner, updatePost);
router.delete("/:id", auth, postOwner, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", commentPost);

export default router;
