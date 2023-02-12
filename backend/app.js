// On importe nos variables d'environnement
require('dotenv').config()

// On importe le framework express
const express = require('express');
// On importe le package mongoose
const mongoose = require('mongoose');
// On importe path pour pouvoir accéder au path de notre serveur
const path = require('path');

// On importe nos routeurs
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// On crée notre application express
const app = express();

// On connecte notre API à notre base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// On extrait le corps JSON des requêtes POST de Content-Type application/json pour accéder à leur contenu dans req.body
app.use(express.json());

// On évite les erreurs de CORS en ajoutant des headers de contrôle d'accès
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // On permet à tout le monde d'accéder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // On ajoute les headers aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // On accepte les types de requêtes mentionnées
    next();
  });

// On enregistre nos routeurs pour les demandes affectuées vers api/auth et api/sauces
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Ajout d'une route pour gérer les images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On exporte notre application express pour l'utiliser dans le fichier server.js
module.exports = app;