const mongoose = require("mongoose");

const routineSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "specialists",
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  exercices: {
    type: [
      {
        exerciceId: {
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
