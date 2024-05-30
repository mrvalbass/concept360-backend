const express = require("express");
const router = express.Router();
const Exercise = require("../models/exercises");
const User = require("../models/users");
const Routine = require("../models/routines");

// req.query qui fonctionne grace au front (gérer les filters dans le front, permet de faire évoluer la plateforme)

//Get exercises according to the query string (get all exercises if no query)
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find(req.query).populate("createdBy");
    res.json({ result: true, exercises });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Create a new exercise
router.post("/", async (req, res) => {
  try {
    const creator = await User.findOne({
      token: req.body.creatorToken,
    });

    const newExercise = await new Exercise({
      title: req.body.title,
      movement: req.body.movement,
      bodyParts: req.body.bodyParts,
      disciplines: req.body.disciplines,
      videoLink: req.body.videoLink,
      createdBy: creator._id,
      description: req.body.description,
    }).save();
    res.json({ result: true, newExercise });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Update an Exercise
router.put("/:id", async (req, res) => {
  try {
    const newData = req.body;
    const exercise = await Exercise.findOneAndUpdate(
      { _id: req.params.id },
      newData,
      { new: true }
    );
    if (!exercise) {
      return res.json({ message: "Exercise not found" });
    }
    res.json({ result: true, exercise });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

//Delete an exercise
router.delete("/:id", async (req, res) => {
  try {
    //Remove exercise from all routines that contains it
    await Routine.updateMany(
      {},
      {
        $pull: { exercises: { exercise: req.params.id } },
      }
    );
    //Remove empty routines
    await Routine.deleteMany({ exercises: { $size: 0 } });
    //Delete exercice once it's not used anymore
    const result = await Exercise.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) throw new Error("Exercise not found");
    res.json({ result: true, message: "Exercise deleted successfully" });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
