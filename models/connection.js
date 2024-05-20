const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTION_STRING, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
