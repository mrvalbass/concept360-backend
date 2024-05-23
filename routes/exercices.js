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
      freeText: req.body.freeText,
    }).save();
    res.json({ result: true, exercices: newExercice });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.post("/:title", async (req, res) => {
  try {
    const newData = req.body;

    const updatedExercice = await Exercice.findOneAndUpdate(
      { title: req.params.title },
      newData,
      {
        new: true,
      }
    );
    if (!updatedExercice) {
      return res.json({ message: "Exercice not found" });
    }
    res.json({ result: true, exercices: updatedExercice });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.get("/exerciceList", (req, res) => {
  Exercice.find()
    .populate("createdBy")
    .then((data) => {
      res.json({ result: true, exercices: data });
    });
});

// req.query qui fonctionne grace au front (gérer les filters dans le front, permet de faire évoluer la plateforme)
router.get("/filter", async (req, res) => {
  try {
    const data = await Exercice.find(req.query);
    console.log("hello", data, req.body.movement, Exercice);
    if (data.deletedCount === 0) {
      return res.json({ result: false, message: "Exercice not found" });
    }
    res.json({ result: true, data: data });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.delete("/:title", async (req, res) => {
  try {
    const result = await Exercice.deleteOne({ title: req.params.title });
    if (result.deletedCount === 0) {
      return res.json({ result: false, message: "Exercice not found" });
    }
    res.json({ result: true, message: "Exercice deleted successfully" });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
