const express = require("express");
const router = express.Router();
const Exercice = require("../models/exercices");

router.post("/", async (req, res) => {
  try {
    const newExercice = await new Exercice({
      title: req.body.title,
      movement: req.body.movement,
      bodyPart: req.body.bodyPart,
      specialities: req.body.specialities,
      videoLink: req.body.videoLink,
      createdBy: req.body.createdBy,
    }).save();
    res.json({ result: true, exercices: newExercice });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.post("/:title", (req, res) => {
  const updatedData = req.body;

  Exercice.findOneAndUpdate({ Title: req.params.title }, updatedData, {
    new: true,
  }).then((updatedExercice) => {
    if (!updatedExercice) {
      return res.json({ message: "Exercice not found" });
    }
    res.json(updatedExercice);
  });
});

//---------------------------------- route à compléter -----------------
// router.get("/findExercices", (req, res) => {
//   Exercice.findAll();
// });
//-----------------------------------------------------------------------

router.delete("/:title", (req, res) => {
  Exercice.deleteOne({ title: req.params.title }).then((result) => {
    if (result.deletedCount === 0) {
      return res.json({ result: false, message: "Exercice not found" });
    }
    res.json({ result: true, message: "Exercice deleted successfully" });
  });
});

module.exports = router;
