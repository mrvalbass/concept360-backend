const express = require("express");
const router = express.Router();
const Specialist = require("../models/specialists");

router.get("/", async (req, res) => {
  const listSpecialist = await Specialist.find();
  res.json({ result: true, Specialist: listSpecialist });
});

module.exports = router;
