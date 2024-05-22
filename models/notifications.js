const mongoose = require("mongoose");

const noticationSchema = mongoose.Schema({
  createDate: {
    type: Date,
    default: () => Date.now(),
  },
  status: {
    type: String,
    enum: ["action", "reminder"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const Notification = mongoose.model("notification", noticationSchema);
module.exports = Notification;
