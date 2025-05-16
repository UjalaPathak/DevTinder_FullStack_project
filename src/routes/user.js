const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

// get all the interested/pending request for the loggedIN user
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInuser._id,
      status: "interested",
    }).populate("toUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
module.exports = {
  userRouter,
};

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("toUserId", ["firstName", "lastName", "photoUrl"])
      .populate("fromUserId", ["firstName", "lastName"]);

    const data = await connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return res.json({
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
