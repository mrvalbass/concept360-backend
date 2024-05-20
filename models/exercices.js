const mongoose = require("monggose");

const exerciceSchema = mongoose.Schema({
  title: String,
  movement: String,
  bodyPart: [String],
  specialities: [String],
  videoLink: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, //clé étrangère vers users
  date: Date,
});

const Exercice = mongoose.model("exercices", exerciceSchema);
module.exports = Exercice;
