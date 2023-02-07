const express = require('express'); // importation d'express
const mongoose = require('mongoose'); // importation de mongoose

const app = express(); // appel de la méthode express - permet de créer une application express

mongoose.connect('mongodb+srv://Flo974:P6974@clusterp6.zs9g2at.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // permettre d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permettre d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // permettre d'envoyer des requêtes avec les méthodes mentionnées
    next();
  });

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});
  
app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => { // use pour tout type de requête
    res.json({ message: 'Votre requête a bien été reçue !' }); // renvoie d'une réponse en json
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app; // export de l'application express pour l'utiliser dans les autres fichiers