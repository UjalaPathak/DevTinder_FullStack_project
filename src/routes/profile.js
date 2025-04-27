const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
//singe Profile check
profileRouter
  .get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  })
  .patch("/profile", async (req, res) => {
    const userId = req.body._id;
    const data = req.body;
    console.log("data", data);
    try {
      const updateValue = [
        "_id",
        "photoUrl",
        "description",
        "skills",
        "gender",
      ];

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
  })
  .delete("/profile", async (req, res) => {
    const id = req.body._id;
    try {
      const value = await User.findByIdAndDelete(id);
      res.send(value);
    } catch (err) {
      res.status(400).send("User not found");
    }
  })
  .get("/profile", async (req, res) => {
    // const email = req.body.email;
    try {
      // find all the document
      const users = await User.find({});
      res.send(users);
    } catch (err) {
      res.status(400).send("user not found");
    }
  });

module.exports = { profileRouter };
