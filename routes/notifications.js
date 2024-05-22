const express = require("express");
const router = express.Router();
const Notification = require("../models/notifications");
const User = require("../models/users");
const { ObjectId } = require("mongoose").Types;

// route POST pour récuperer les notification envoyé par le specialiste
router.post("/", async (req, res) => {
  //const validStatuses = ["action", "reminder"];
  try {
    const sender = await User.findOne({ token: req.body.senderToken });
    const receiver = await User.findOne({ token: req.body.receiverToken });
    const { title, content, status } = req.body;
    const newNotification = await new Notification({
      createDate: Date.now(),
      status, // action or reminder (rappel)
      title,
      content,
      sender: sender._id,
      receiver: receiver._id, //je ne suis pas sur
    }).save();
    res.json({ result: true, newNotification });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

// route GET qui sert à afficher les notifications

router.get("/:user", async (req, res) => {
  try {
    const userId = req.params.user;
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender")
      .populate("receiver");

    res.json({ results: true, notif: notifications });
  } catch (error) {
    res.status(500).json({ results: false, error: error.message });
  }
});

// route pour supprimer une seule notification à l'icon prévus

router.delete("/deleteOneNotif/:id", async (req, res) => {
  console.log("req is", req.params.id);
  try {
    const deleteResult = await Notification.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      res.status(404).json({ result: false, message: "No notification" });
    }

    res.json({ result: deleteResult });
  } catch (error) {
    res.status(500).json({ results: false, error: error.message });
  }
});

// route pour supprimer toutes les notifs via le bouton prévus
router.delete("/deleteManyNotif", async (req, res) => {
  try {
    const receiver = await User.findOne({ token: req.body.receiverToken });
    console.log("receiver ", receiver);

    if (!receiver) {
      return res.status(404).json({ results: false, error: "User not found" });
    }

    const result = await Notification.deleteMany({ receiver: receiver._id });
    console.log("is ", receiver._id);
    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ results: false, error: error.message });
  }
});

module.exports = router;
