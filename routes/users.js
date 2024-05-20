const express = require("express");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/users");

/* GET users listing. */
router.get("/", async (req, res) => {
  const listUser = await User.find();
  res.json({ result: true, user: listUser });
});

router.post("/signup", async (req, res) => {
  try {
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
    }).save();
    res.json({ result: true, token: newUser.token });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
