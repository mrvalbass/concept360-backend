const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "title missing"],
    unique: true,
  },
  movement: {
    type: String,
    required: [true, "movement missing"],
  },
  bodyParts: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
    },
  },
  disciplines: {
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
    required: true,
  }, //clé étrangère vers users
  creationDate: {
    type: Date,
    default: () => Date.now(),
  },
  description: String,
});

const Exercise = mongoose.model("exercises", exerciseSchema);
module.exports = Exercise;
