const mongoose = require('monggose');

const exerciceSchema = mongoose.Schema({
    Title : string,
	Movement : string,
	bodyPart : [ string ],
	Spécialities : [ string ],
	videoLink : string,
 	createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, //clé étrangère vers users
	Date : date,

})

const Exercice = mongoose.model('exercices', exerciceSchema);
module.exports = Exercice;