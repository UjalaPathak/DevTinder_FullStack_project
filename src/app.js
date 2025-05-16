const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");
const { appSchema } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");

//middlewear
app.use(express.json());
app.use(cookieParser());
app.use("/", appSchema);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/feed", async (req, res) => {
  const userId = req.query._id;
  console.log("ID from query:", userId);

  try {
    // find all the document
    const users = await User.findById(userId).exec();
    console.log("User result:", users);
    if (!users) {
      return res.status(404).send("user not found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("user not found");
  }
});

app.post("/query-user", async (req, res) => {
  const id = req.body._id;

  try {
    const value = await User.findByIdAndUpdate(id, {
      firstName: "aaliya",
    }).exec();
    res.send(value);
  } catch (err) {
    res.status(400).send("user not dound");
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected!");
    app.listen(7777, () => {
      console.log("listen at port 7777");
    });
  })
  .catch(() => {
    console.log("Database is not connected!");
  });
