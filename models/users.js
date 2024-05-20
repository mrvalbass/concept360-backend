const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  picture: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  token: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;