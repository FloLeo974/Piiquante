const express = require('express'); // importation d'express

const app = express(); // appel de la méthode express - permet de créer une application express

app.use((req, res) => { // use pour tout type de requête
    res.json({ message: 'Votre requête a bien été reçue !' }); // renvoie d'une réponse en json
 });

module.exports = app; // export de l'application express pour l'utiliser dans les autres fichiers