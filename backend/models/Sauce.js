// On importe le package mongoose
const mongoose = require('mongoose');

// On crée un schéma de données pour nos sauces
const sauceSchema = mongoose.Schema({
    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl:{ type: String, required: true },
    heat:{ type: Number, required: true },
    likes:{ type: Number, default: 0 },
    dislikes:{ type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

// On exporte notre schéma en tant que modèle Mongoose, pour l'utiliser dans notre application Express
module.exports = mongoose.model('Sauce', sauceSchema);