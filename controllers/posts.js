import express from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    return res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    return res.json({ data: posts });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await PostMessage.find({ name });

    return res.json({ data: posts });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    return res.status(201).json(newPostMessage);
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const id = req.verifyparam;
  const { title, message, creator, selectedFile, tags } = req.body;

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  return res.status(201).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const id = req.verifyparam;

  await PostMessage.findByIdAndRemove(id);

  return res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const id = req.verifyparam;

  const post = await PostMessage.findById(id);

  if (post.creator === req.userId) {
    return res.status(409).json("you cannot like or dislike your own posts");
  }

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  return res.status(200).json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  return res.json(updatedPost);
};

export default router;
