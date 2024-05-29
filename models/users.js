const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  token: String,
  profilePictureURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dlrwpjznf/image/upload/v1716969994/adfslha71z4u1xova1jm.png",
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
