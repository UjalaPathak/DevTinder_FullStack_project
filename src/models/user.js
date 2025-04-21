const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 240,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxlength: 240,
      trim: true,
    },
    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" Invalid Email address: " + value);
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    password: {
      type: String,
      minLength: 10,
      maxlength: 120,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong it should contain 1lowercase , 1uppercase ,1 specialcharacter,minLength:8"
          );
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgUzbUU1yuh5KbhSIcEK8vRr1qoOG9OQYvvg&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("not a valid URL");
        }
      },
    },
    description: {
      type: String,
      default: "this is default description",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
