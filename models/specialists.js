const mongoose = require("mongoose");

const specialistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  discipline: { type: String, required: true },
  lien: String,
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "patients" }],
});

const Specialist = mongoose.model("specialists", specialistSchema);

module.exports = Specialist;
