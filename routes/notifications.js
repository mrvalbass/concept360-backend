const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// route POST pour récuperer les notification envoyé par le specialiste
router.post("newNotif", (req, res) => {
  User.findOne({ role: req.body.spe }).then((data) => {
    const newNotification = new Notification({
      createDate: Date.now(),
      type: data.type, //domaine de specialisation de l'expediteur
      title: req.body.title,
      content: req.body.content,
      sender: data._id,
      receiver: receiver._id,
    });
    newNotification.save().then(() => {
      res.json({ results: true });
    });
  });
});

module.exports = router;
