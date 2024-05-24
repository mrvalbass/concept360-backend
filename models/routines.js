const mongoose = require("mongoose");

const exerciseRoutineSchema = mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exercises",
  },
  reps: Number,
  sets: Number,
});

const routineSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "specialists",
    required: true,
  },
  creationDate: {
    type: Date,
    default: () => Date.now(),
  },
  exercises: {
    type: [exerciseRoutineSchema],
    required: true,
  },
});

const Routine = mongoose.model("routines", routineSchema);

module.exports = Routine;
