const mongoose = require("mongoose");
const PostMessage = require("../models/postMessage.js");

const postOwner = async (req, res, next) => {
  if (!req.userId) {
    return res.json({ message: "notAuthorize" });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: `noPost` });

  try {
    const findPost = await PostMessage.findById(id);

    if (!findPost) return res.status(404).json({ message: `noPost` });

    if (findPost.creator !== req.userId)
      return res.status(401).json({ message: `postOwner` });

    req.verifyparam = id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "notAuthorize" });
  }
};

module.exports = postOwner;
