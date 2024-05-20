const express = require("express");
const router = express.Router();
const Routine = require("../models/routines");
const User = require("../models/users");
const { ObjectId } = require("mongoose").Types;

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
            exerciceId: new ObjectId("664b12d9f4340a039c9a7f59"),
            rep: 10,
            series: 3,
            comment: "Attention aux genoux",
          },
        ],
      }).save();
    } else {
      console.log(routine);
    }

    res.json({ result: true });
  } catch (err) {
    console.log(err);
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
