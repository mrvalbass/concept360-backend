const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  picture: String,
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
