const http = require('http'); // import du package http de node
const app = require('./app'); // import de l'appli depuis app.js

const normalizePort = val => { // la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port); // indique à l'appli express sur quel port tourner

  const errorHandler = error => { // la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

const server = http.createServer(app); // création du serveur avec l'appli en argument

server.on('error', errorHandler);
server.on('listening', () => { // écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // écoute des requêtes envoyées au serveur avec la méthode listen du serveur