const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const postRoutes = require("./routes/posts.js");
const userRouter = require("./routes/user.js");

// dotenv.config();

const app = express();

var corsOptions = {
  origin: ["http://localhost:3000", "https://hd-memories.netlify.app/", "https://hd-memories.netlify.app/*"],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};


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

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(helmet());


app.use("/posts", postRoutes);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

// const CONNECTION_URL = process.env.MONGO_URL;
// const PORT = process.env.PORT || 5000;

// if (!CONNECTION_URL) {
//   process.exit(1);
// }

mongoose
  .connect(
    "mongodb+srv://nima:nima1235789@cluster0.esimseh.mongodb.net/international-memory"
  )
  .then(() =>
    app.listen(3000, () => {
      console.log(`Server is running`);
    })
  )
  .catch((error) => {
    console.log(`${error} did not connect`);
    process.exit(1);
  });
