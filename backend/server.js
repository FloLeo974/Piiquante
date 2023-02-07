const http = require('http'); // import du package http de node
const app = require('./app'); // import de l'appli depuis app.js

app.set('port', process.env.PORT || 3000); // indique à l'appli express sur quel port tourner
const server = http.createServer(app); // création du serveur avec l'appli en argument

server.listen(process.env.PORT || 3000); // écoute des requêtes envoyées au serveur avec la méthode listen du serveur