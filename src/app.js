const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Namstre Nodejs");
});

app.use("/hello", (req, res) => {
  res.send("Hello ");
});

app.listen(7777, () => {
  console.log("listen at port 3000");
});
