const mongoose = require("mongoose");

const programRoutineSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  routine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "routines",
    required: true,
    _id: false,
  },
  comment: {
    type: String,
  },
  done: {
    type: Boolean,
    default: false,
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

const programSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patients",
    required: true,
  },
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "specialists",
    required: true,
  },
  program: [programRoutineSchema],
  notes: String,
});

programSchema.index({ patient: 1, date: 1, specialist: 1 }, { unique: true });

const Program = mongoose.model("programs", programSchema);

module.exports = Program;
