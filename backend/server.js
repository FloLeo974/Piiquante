const http = require('http'); // import du package http de node

const server = http.createServer((req, res) => { // création du serveur - arguments: requête et réponse
    res.end('Voilà la réponse du serveur !'); // réponse basique temporaire avec la méthode "end" de l'objet réponse
});

server.listen(process.env.PORT || 3000); // écoute des requêtes envoyées au serveur avec la méthode listen du serveur