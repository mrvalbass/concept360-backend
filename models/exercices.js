const mongoose = require("mongoose");

const exerciceSchema = mongoose.Schema({
  title: { type: String, required: [true, "title missing"], unique: true },
  movement: { type: String, required: [true, "movement missing"] },
  bodyPart: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
    },
  },
  specialities: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
    },
  },
  videoLink: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  }, //clé étrangère vers users
  creationDate: {
    type: Date,
    default: () => Date.now(),
  },
  freeText: String,
});

const Exercice = mongoose.model("exercices", exerciceSchema);
module.exports = Exercice;
