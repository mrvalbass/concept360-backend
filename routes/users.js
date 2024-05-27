const express = require("express");
const cloudinary = require("cloudinary").v2;
const uid2 = require("uid2");
const fs = require("fs");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/users");
const Specialist = require("../models/specialists");
const Patient = require("../models/patients");
const mongoose = require("mongoose");

/* GET users listing. */
router.get("/", async (req, res) => {
  const listUser = await User.find();
  res.json({ result: true, user: listUser });
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ result: true, user });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/state/:state", async (req, res) => {
  try {
    if (req.params.state === "specialist") {
      const listSpecialist = await Specialist.find();
      res.json({ result: true, Specialist: listSpecialist });
    } else if (req.params.state === "patient") {
      const listPatient = await Patient.find().populate("user");
      res.json({ result: true, Patient: listPatient });
    }
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/getPatientList/:specialistId", async (req, res) => {
  try {
    const specialist = await Specialist.findById(
      req.params.specialistId
    ).populate({
      path: "patients",
      populate: "user",
    });
    res.json({ result: true, PatientList: specialist.patients });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/token/:token", async (req, res) => {
  try {
    if (!req.params.token) throw new Error("no token provided");
    const user = await User.findOne({ token: req.params.token });
    const specialist = await Specialist.findOne({ user: user._id }).populate(
      "user"
    );
    const patient = await Patient.findOne({ user: user._id }).populate("user");

    res.json({ result: true, specialist, patient });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    if (!req.body.state) throw new Error("no state provided");
    const user = await User.findOne({ email: req.body.email });
    if (user) throw new Error("User already exist");

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
    res.json({ result: true, token: newUser.token });
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");
    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error("Password is incorrect");
    res.json({ result: true, token: user.token });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.post("/addPatient/:specialistId", async (req, res) => {
  try {
    await Patient.updateOne(
      { _id: req.body.patientId },
      { $push: { specialists: req.params.specialistId } }
    );
    await Specialist.updateOne(
      { _id: req.params.specialistId },
      { $push: { patients: req.body.patientId } }
    );
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.delete("/deletePatient/:specialistId", async (req, res) => {
  try {
    const patientId = new mongoose.Types.ObjectId(`${req.body.patientId}`);

    await Patient.updateOne(
      {
        _id: patientId,
      },
      {
        $pull: { specialists: req.params.specialistId },
      }
    );

    await Specialist.updateOne(
      {
        _id: req.params.specialistId,
      },
      {
        $pull: { patients: patientId },
      }
    );

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

// route pour envoyer et récuperer les photos dans cloundinary

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});

router.get("/getProfil", async (req, res) => {
  try {
    // Récupérer les photos de profil depuis Cloudinary
    const profileImages = await cloudinary.v2.uploader
      .explicit("sample", { type: "image/jpeg" })
      .then((result) => console.log(result));
    res.json({ profileImages });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des photos de profil depuis Cloudinary:",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des photos de profil" });
  }
});
module.exports = router;
