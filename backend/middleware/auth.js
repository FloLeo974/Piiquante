// On importe le package jsonwebtoken
const jwt = require('jsonwebtoken');

// On crée notre middleware d'authentification
module.exports = (req, res, next) => {
    try {
        // On extraie le token du header Authorization de la requête entrante 
        const token = req.headers.authorization.split(' ')[1];
        // On décode le token et on vérifie s'il est valide
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // On extraie l'ID utilisateur du token et on le rajoute à l’objet request afin que nos différentes routes puissent l’exploiter.
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } 
    catch(error) {
        res.status(401).json({ error })
    }
};