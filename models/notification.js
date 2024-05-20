const mongoose = require("mongoose");
const { type } = require("os");

const noticationSchema = mongoose.Schema({
  createDate: Date,
  type: String,
  title: String,
  content: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Notification = mongoose.model("notification", noticationSchema);
module.exports = Notification;
