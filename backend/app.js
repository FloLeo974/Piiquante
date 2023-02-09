require('dotenv').config()

const express = require('express'); // importation d'express
const mongoose = require('mongoose'); // importation de mongoose
const path = require('path');

const userRoutes = require('./routes/user');
const app = express(); // appel de la méthode express - permet de créer une application express

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // prend les requêtes qui ont comme Content-Type application/json et met à disposition leur body dans req.body

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // permettre d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permettre d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // permettre d'envoyer des requêtes avec les méthodes mentionnées
    next();
  });

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // export de l'application express pour l'utiliser dans les autres fichiers