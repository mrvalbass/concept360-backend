const express = require("express");
const router = express.Router();
const Program = require("../models/programs");
const User = require("../models/users");
const Patient = require("../models/patients");
const moment = require("moment");

//Get a patient program

router.get("/user/:userId/:date", async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.userId });
    console.log(patient);
    const userProgram = await Program.findOne({
      patient: patient._id,
    })
      .populate({
        path: "specialist",
        populate: {
          path: "user",
          select: "-_id firstName lastName",
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

    userProgram.program = userProgram.program.filter((programRoutine) => {
      return moment(programRoutine.date).unix() === +req.params.date;
    });

    res.json({ result: true, userProgram });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/:specialistId/:patientId", async (req, res) => {
  try {
    const userProgram = await Program.findOne({
      patient: req.params.patientId,
      specialist: req.params.specialistId,
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
        },
      });
    if (!userProgram) throw new Error("Program not found");
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

router.put("/saveNotes/:id", async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id },
      { notes: req.body.notes }
    );
    res.json({ result: true, program });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.put("/addRoutine/:id", async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
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
    res.json({ result: true, program });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.put("/deleteRoutine/:id", async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          program: {
            _id: req.body.programRoutine,
          },
        },
      },
      { new: true }
    );
    res.json({ result: true, program });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.put("/toggleDone/:id", async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, "program._id": req.body.programRoutine },
      { $set: { "program.$.done": req.body.done } },
      { new: true }
    );
    res.json({ result: true, program });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
