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
  routine: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "routines",
    required: true,
    _id: false,
  },
  done: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
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

routineSchema.index({ patient: 1, date: 1, specialist: 1 }, { unique: true });

const Routine = mongoose.model("routines", routineSchema);

module.exports = Routine;
