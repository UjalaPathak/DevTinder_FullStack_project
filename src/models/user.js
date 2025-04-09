const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
});

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
