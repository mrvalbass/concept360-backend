const mongoose = require("mongoose");

const routineSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "specialists",
    required: true,
  },
  creationDate: {
    type: Date,
    default: () => Date.now(),
  },
  exercices: {
    type: [
      {
        exercice: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "exercices",
        },
        reps: Number,
        series: Number,
      },
    ],
    ref: "exercices",
    required: true,
    _id: false,
  },
});

const Routine = mongoose.model("routines", routineSchema);

module.exports = Routine;
