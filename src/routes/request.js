const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("req", req);
  const { user } = req.user;
  console.log("user", user);
  res.send(user.firstName + "send connection Request");
});

module.exports = requestRouter;
