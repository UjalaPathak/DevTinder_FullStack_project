const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const User = require("./models/user");
const { validateSignuData } = require("./utils/validateSignup");
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignuData(req.body);

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("passwordMatch", passwordMatch);
    if (!passwordMatch) {
      throw new Error("Invalid Credential");
    }
    res.send("Successfully login");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  // const email = req.body.email;
  try {
    // find all the document
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("user not found");
  }
});

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

app.delete("/user", async (req, res) => {
  const id = req.body._id;
  try {
    const value = await User.findByIdAndDelete(id);
    res.send(value);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  console.log("data", data);
  try {
    const updateValue = ["_id", "photoUrl", "description", "skills", "gender"];

    const allowedUpdateValue = Object.keys(data).every((k) => {
      return updateValue.includes(k);
    });

    console.log("allowedUpdateValue", allowedUpdateValue);
    if (!allowedUpdateValue) {
      throw new Error("User Can not be updated");
    }
    const value = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send(value);
  } catch (err) {}
  res.status(400).send("User not updated successfully");
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
