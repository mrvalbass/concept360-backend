const express = require("express");
const router = express.Router();
const Program = require("../models/programs");
const User = require("../models/users");
const Patient = require("../models/patients");

//Get a patient program
router.get("/patient/:patientId", async (req, res) => {
  try {
    const userProgram = await Program.findOne({
      patient: req.params.patientId,
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "-_id firstName lastName email createdAt",
        },
        select: "-_id user",
      })
      .populate({
        path: "program.routine",
        populate: {
          path: "exercises.exercise",
          select: "-_id",
        },
        select: "-_id",
      });
    res.json({ result: true, userProgram });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.userId });

    const userProgram = await Program.findOne({
      patient: patient._id,
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "-_id firstName lastName email createdAt",
        },
        select: "-_id user",
      })
      .populate({
        path: "program.routine",
        populate: {
          path: "exercises.exercise",
          select: "-_id",
        },
        select: "-_id",
      });
    res.json({ result: true, userProgram });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const specialist = await User.findOne({
      token: req.body.specialistId,
    });

    const programData = await Program.findOne({
      patient: req.body.patientId,
      specialist: specialist._id,
    });

    if (!programData) {
      const newProgram = await new Program({
        patient: req.body.patientId,
        specialist: specialist._id,
        program: {
          date: new Date(req.body.date),
          routine: req.body.routineId,
        },
      }).save();
      res.json({ result: true, newProgram });
    } else {
      throw new Error("Program already initialized");
    }
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.notes !== undefined) {
      await Program.findOneAndUpdate(
        { _id: req.params.id },
        {
          notes: req.body.notes,
        }
      );
    }
    if (req.body.date) {
      await Program.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            program: {
              date: req.body.date,
              routine: req.body.routine,
              comment: req.body.comment,
            },
          },
        }
      );
    }
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
