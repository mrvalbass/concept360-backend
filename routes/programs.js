const express = require("express");
const router = express.Router();
const Program = require("../models/programs");
const Routine = require("../models/routines");
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const specialist = await User.findOne({
      token: req.body.specialistToken,
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

router.post("/:id/:exerciceId?", async (req, res) => {
  try {
    const {
      moodStart,
      moodEnd,
      personalNotes,
      sharedNotes,
      done,
      reps,
      series,
      comment,
    } = req.body;

    // Update general data about the routine
    await Routine.updateOne(
      { _id: req.params.id },
      { moodStart, moodEnd, personalNotes, sharedNotes }
    );

    // Update data relative to one Exercice
    await Routine.updateOne(
      {
        _id: req.params.id,
        "exercices.exerciceId": req.params.exerciceId,
      },

      {
        $set: {
          "exercices.$.comment": comment,
          "exercices.$.reps": reps,
          "exercices.$.series": series,
          "exercices.$.done": done,
        },
      }
    );

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

router.get("/:patientId", async (req, res) => {
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
          path: "exercices.exercice",
          select: "-_id",
        },
        select: "-_id",
      });
    res.json({ result: true, userProgram });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
