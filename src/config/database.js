const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteDev:KKdsDYo2ByKcpq9y@namastedev.8rzffxu.mongodb.net/"
  );
};

module.exports = connectDB;
