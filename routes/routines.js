const express = require("express");
const router = express.Router();
const Routine = require("../models/routines");
const User = require("../models/users");

//Route to create a new routine
router.post("/", async (req, res) => {
  try {
    const creator = await User.findOne({
      token: req.body.creatorToken,
    });

    const routine = await new Routine({
      createdBy: creator._id,
      exercices: [
        {
          exercice: req.body.exercice,
          reps: req.body.reps,
          series: req.body.series,
        },
      ],
    }).save();

    res.json({ result: true, routine });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Route to update a routine
//A routine Id is mandatory in params to target the routine to modify
//An exerciceId in params is optional and must be added if you want to add a new Exercice to the routine
//The body can contain reps, series, and updateExerciceId
//updateExerciceId is useful when modifying the reps and sets of an existing exercice in the routine and therefore has no interest if there is an ExerciceId in the params to create a new Exercice.
router.put("/:id/:createExerciceId?", async (req, res) => {
  try {
    const { reps, series, updateExerciceId } = req.body;
    const routine = await Routine.findById(req.params.id);
    const exerciceIdList = routine.exercices.map((exercice) =>
      exercice.exerciceId.toString()
    );

    // Add new exercise to routine
    if (req.params.createExerciceId) {
      if (!exerciceIdList.includes(req.params.exerciceId)) {
        routine.exercices.push({
          exercice: req.params.createExerciceId,
          reps,
          series,
        });
        await routine.save();
      } else {
        throw new Error("Exercice already in routine");
      }
    }
    // Update data relative to one Exercice
    else {
      const updateExerciceIndex = exerciceIdList.findIndex(
        (id) => id === updateExerciceId
      );
      routine.exercices[updateExerciceIndex].reps = reps;
      routine.exercices[updateExerciceIndex].series = series;
      await routine.save();
    }
    res.json({ result: true, routine });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Route to get the routines based on the filers passed in a query string
router.get("/", async (req, res) => {
  try {
    const creator = await User.findOne({
      token: req.query.createdBy,
    });

    const userRoutine = await Routine.find({ createdBy: creator._id });
    res.json({ result: true, userRoutine });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
