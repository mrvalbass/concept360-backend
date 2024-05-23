const express = require("express");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/users");
const Specialist = require("../models/specialists");
const Patient = require("../models/patients");

//Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json({ result: true, users });
});

//Get 1 user by Id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("User not found");
    res.json({ result: true, user });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Get all specialists
router.get("/specialists", async (req, res) => {
  try {
    const specialists = await Specialist.find().populate("user");
    res.json({ result: true, specialists });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Get 1 specialist by Token
router.get("/specialists/:token", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });
    const specialist = await Specialist.findOne({ user: user._id }).populate(
      "user"
    );
    res.json({ result: true, specialist });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Get all patients
router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find().populate("user");
    res.json({ result: true, patients });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});
6;
//Get one patient by Token
router.get("/patients/:token", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });
    const patient = await Patient.findOne({ user: user._id }).populate("user");
    res.json({ result: true, patient });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Get patients linked to one specialist
router.get("/patients/:specialistId", async (req, res) => {
  try {
    const specialist = await Specialist.findById(
      req.params.specialistId
    ).populate({
      path: "patients",
      populate: "user",
    });
    res.json({ result: true, patients: specialist.patients });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Create a new user
router.post("/signup", async (req, res) => {
  try {
    if (!req.body.state) throw new Error("no state provided");
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
    }).save();

    if (req.body.state === "specialist") {
      if (!req.body.discipline) throw new Error("no discipline provided");
      await new Specialist({
        user: newUser._id,
        discipline: req.body.discipline,
      }).save();
    }
    if (req.body.state === "patient") {
      await new Patient({
        user: newUser._id,
      }).save();
    }
    res.json({ result: true, newUser });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Check user credentials and send back its data
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");
    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error("Password is incorrect");
    res.json({ result: true, user });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Add a link between a specialist and a patient
router.put("/specialists/addPatient", async (req, res) => {
  try {
    await Patient.updateOne(
      { _id: req.body.patientId },
      { $push: { specialists: req.body.specialistId } }
    );
    await Specialist.updateOne(
      { _id: req.body.specialistId },
      { $push: { patients: req.body.patientId } }
    );
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Remove a link between a specialist and a patient
router.put("/specialists/deletePatient", async (req, res) => {
  try {
    await Specialist.updateOne(
      { _id: req.body.specialistId },
      { $pull: { patients: req.body.patientId } }
    );
    await Patient.updateOne(
      { _id: req.body.patientId },
      { $pull: { specialists: req.body.specialistId } }
    );
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
