const mongoose = require("mongoose");

const programSubSchema = mongoose.Schema(
  {
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
  },
  { _id: false }
);

const programSchema = mongoose.Schema({
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
  program: [programSubSchema],
});

programSchema.index({ patient: 1, date: 1, specialist: 1 }, { unique: true });

const Program = mongoose.model("programs", programSchema);

module.exports = Program;
