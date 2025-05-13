const mongoose = require("mongoose");
const ConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

ConnectionSchema.index({ fromUserId: 1 });

//arrow function will not work here, its like before saving the function will be called
ConnectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const connectionRequest = new mongoose.model(
  "ConnectionSchema",
  ConnectionSchema
);

module.exports = connectionRequest;
