import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

const postOwner = async (req, res, next) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  const { id } = req.params;
  console.log("test");
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const findPost = await PostMessage.findById(id);

    if (!findPost) return res.status(404).json(`No post with id: ${id}`);

    if (findPost.creator !== req.userId)
      return res.status(401).json(`you can only work on your own posts`);

    req.verifyparam = id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "you are not autorized" });
  }
};

export default postOwner;
