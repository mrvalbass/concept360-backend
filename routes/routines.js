const express = require("express");
const router = express.Router();
const Routine = require("../models/routines");
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const specialist = await User.findOne({
      token: req.body.specialistToken,
    });

    const patient = await User.findOne({
      token: req.body.patientToken,
    });

    const routine = await Routine.findOne({
      patient: patient._id,
      specialist: specialist._id,
      date: new Date(req.body.date),
    });

    if (!routine) {
      await new Routine({
        specialist: specialist._id,
        patient: patient._id,
        date: new Date(req.body.date),
        exercices: [
          {
            exerciceId: req.body.exerciceId,
            reps: req.body.reps,
            series: req.body.series,
            comment: req.body.comment,
          },
        ],
      }).save();
    } else {
      if (
        //If exercise not in routine
        !routine.exercices
          .map((exercice) => exercice.exerciceId.toString())
          .includes(req.body.exerciceId)
      ) {
        routine.exercices.push({
          exerciceId: req.body.exerciceId,
          reps: req.body.reps,
          series: req.body.series,
          comment: req.body.comment,
        });
        await routine.save();
      } else {
        throw new Error("Exercice already in routine");
      }
    }

    res.json({ result: true, routine });
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

router.get("/:userId", async (req, res) => {
  try {
    const userRoutine = await Routine.find({ patient: req.params.userId });
    res.json({ result: true, userRoutine });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
