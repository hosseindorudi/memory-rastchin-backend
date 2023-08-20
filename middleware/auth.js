// import dotenv from "dotenv";
// dotenv.config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const secret = "test";

  if (!secret) {
    return res.status(401).json({ message: "notAuthorize" });
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "notAuthorize" });
  }
};

module.exports = auth;
