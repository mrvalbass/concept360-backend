const express = require("express");
const router = express.Router();
const Patient = require("../models/patients");

router.get("/", async (req, res) => {
  const listPatient = await Patient.find();
  res.json({ result: true, Patient: listPatient });
});

module.exports = router;
