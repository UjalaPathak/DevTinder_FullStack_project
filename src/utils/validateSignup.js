var validator = require("validator");

const validateSignuData = (req) => {
  console.log("dgdffvha", req);

  const { firstName, lastName, email, password } = req;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

module.exports = { validateSignuData };
