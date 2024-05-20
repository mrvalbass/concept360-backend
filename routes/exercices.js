var express = require("express");
var router = express.Router();

router.post("/createExercices", (req, res) => {
  if (!(req.body, ["title", "movement", "specialities", "createdBy"])) {
    res.json({ result: false, error: "Missing or empty fields" });
  } else {
    const newExercice = new Exercice({
      title: req.body.title,
      movement: req.body.movement,
      bodyPart: req.body.bodyPart,
      specialities: req.body.specialities,
      videoLink: req.body.videoLink,
      createdBy: req.body.createdBy,
      date: Date.now(),
    });
    newExercice.save().then((newExercice) => {
      res.json({ result: true, exercices: newExercice });
    });
  }
});

router.post("/updateExercice/:title", (req, res) => {
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

//--------------------------------------- route à compléter -----------------
// router.get("/findExercices", (req, res) => {
//   Exercice.findAll();
// });
//---------------------------------------------------------------------------

router.delete("/deleteExercices/:tile", (req, res) => {
  Exercice.deleteOne({ title: req.params.title }).then((result) => {
    if (result.deletedCount === 0) {
      return res.json({ result: false, message: "Exercice not found" });
    }
    res.json({ result: true, message: "Exercice deleted successfully" });
  });
});

module.exports = router;
