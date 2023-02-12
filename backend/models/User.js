// On importe le package mongoose
const mongoose = require('mongoose');

// On importe mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

// On crée un schéma de données pour nos utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On passe mongoose-unique-validator comme plugin pour notre schéma
userSchema.plugin(uniqueValidator);

// On exporte notre schéma en tant que modèle Mongoose, pour l'utiliser dans notre application Express
module.exports = mongoose.model('User', userSchema);