const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  specialists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "specialists",
    },
  ],
});

const Patient = mongoose.model("patients", patientSchema);

module.exports = Patient;
