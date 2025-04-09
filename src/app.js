const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("successfully registered");
  } catch (err) {
    res.status(400).send("Signup failed" + err.message);
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
