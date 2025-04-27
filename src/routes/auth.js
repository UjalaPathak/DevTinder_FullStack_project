const express = require("express");
const appSchema = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignuData } = require("../utils/validateSignup");
const saltRounds = 10;

appSchema
  .post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        throw new Error("Invalid Credential");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Invalid Credential");
      }
      //create token
      const token = jwt.sign({ _id: user._id }, "DEV@TINDER345", {
        expiresIn: "7d",
      });

      res.cookie("token", token);
      res.send("Successfully login");
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  })

  .post("/signup", async (req, res) => {
    try {
      //validate the request
      validateSignuData(req.body);

      const { firstName, lastName, email, password } = req.body;
      //convert password in hash
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

module.exports = { appSchema };
