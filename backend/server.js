// On importe le package HTTP de node
const http = require('http');

// On importe l'application depuis app.js
const app = require('./app');

// On renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Le port sera soit la variable d'environnement du port soit le port 3000
const port = normalizePort(process.env.PORT || '3000');
// On indique à l'application express sur quel port tourner
app.set('port', port);

// On gère les erreurs
const errorHandler = error => {
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

// On crée un serveur en lui passant notre application en argument
const server = http.createServer(app);

server.on('error', errorHandler);

// On ajoute un écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// On demande au serveur d'écouter les requêtes envoyées sur le port
server.listen(port); 