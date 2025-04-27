const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  validateProfileData,
  ValidatePassword,
} = require("../utils/validateProfileData");
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
  .patch("/profile/edit", userAuth, async (req, res) => {
    try {
      if (!validateProfileData(req)) {
        throw new Error("Invalid Edit request");
      }
      const loggedInuser = req.user;

      Object.keys(req.body).forEach((key) => {
        loggedInuser[key] = req.body[key];
      });

      await loggedInuser.save();
      res.send({
        message: `${loggedInuser.firstName}, Updated Successfully`,
        resources: loggedInuser,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  })
  .patch("/profile/password", userAuth, async (req, res) => {
    try {
      console.log("req", req);
      if (!ValidatePassword) {
        throw new Error("Password is not strong");
      }
      const { password } = req.body;

      const user = req.user;
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;

      await user.save();
      res.send({
        message: `${user.firstName}, Updated Successfully`,
        resources: user,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
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
