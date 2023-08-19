import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

var corsOptions = {
  origin: ["*"],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

app.all("*", function (req, res, next) {
  let origin = req.headers.origin;
  if (cors.origin.indexOf(origin) >= 0) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/posts", postRoutes);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.status(200).json("hello world");
});

const CONNECTION_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

if (!CONNECTION_URL) {
  process.exit(1);
}


mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(`${error} did not connect`);
    process.exit(1);
  });

