const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    const isTokenValid = await jwt.verify(token, "DEV@TINDER345");

    const { _id } = isTokenValid;
    const user = await User.findById({ _id: _id });

    if (!user) {
      throw new Error("User is not found");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send("ERROR:", err.message);
  }
};

module.exports = { userAuth };
