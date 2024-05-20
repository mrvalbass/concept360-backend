const mongoose = require("mongoose");

const routineSchema = mongoose.Schema({
  patient: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "patients",
    required: true,
  },
  specialist: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "specialists",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  exercices: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "exercices",
    required: true,
  },
  moodStart: {
    type: String,
  },
  moodEnd: {
    type: String,
  },
  personalNotes: {
    type: String,
  },
  sharedNotes: {
    type: String,
  },
});

routineSchema.index({ patient: 1, date: 1 }, { unique: true });

const Routine = mongoose.model("routines", routineSchema);

module.exports = Routine;
