const express = require("express");
const router = express.Router();
const Routine = require("../models/routines");
const User = require("../models/users");

//Get routines according to the query string
router.get("/", async (req, res) => {
  try {
    const creator = await User.findOne({
      token: req.query.createdBy,
    });

<<<<<<< HEAD
    const routines = await Routine.find().populate("createdBy");
    console.log(routines);
=======
    const routines = await Routine.find().populate("exercises.exercise");
>>>>>>> a369b2c7323858c74d0cfd720590748c0f7c49fb
    res.json({ result: true, routines });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Create a new routine
router.post("/", async (req, res) => {
  try {
    const creator = await User.findOne({
      token: req.body.creatorToken,
    });

    const routine = await new Routine({
      createdBy: creator._id,
      exercises: req.body.exercises,
    }).save();

    res.json({ result: true, routine });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Delete a routine
router.delete("/", async (req, res) => {
  try {
    await Routine.deleteOne({ _id: req.body.routine });
    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Add exercise to a routine
router.put("/:id/addExercise", async (req, res) => {
  try {
    await Routine.updateOne(
      { _id: req.params.id },
      {
        $push: {
          exercises: {
            exercise: req.body.exercise,
            sets: req.body.sets,
            reps: req.body.reps,
          },
        },
      }
    );

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Update exercise in a routine
router.put("/:id/updateExercise", async (req, res) => {
  try {
    await Routine.updateOne(
      {
        _id: req.params.id,
        "exercises._id": req.body.routineExercise,
      },
      {
        $set: {
          "exercises.$.sets": req.body.sets,
          "exercises.$.reps": req.body.reps,
        },
      }
    );

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Remove exercise from a routine
router.put("/:id/deleteExercise", async (req, res) => {
  try {
    await Routine.updateOne(
      { _id: req.params.id },
      { $pull: { exercises: { exercise: req.body.exercise } } }
    );

    res.json({ result: true });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
