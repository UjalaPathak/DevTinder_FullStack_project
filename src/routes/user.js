const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");

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

// get all the accepted request for the loggedIn User
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

// show all the user ( cards to swipe)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //you can't see your own profile
    // you can't see the cards that are rejected or accepted
    // even if the status is interested it should not be seen
    //allraedy send the connection

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * 100;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUserfromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserfromFeed.add(req.fromUserId.toString());
      hideUserfromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserfromFeed) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName  description photoUrl skills")
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
