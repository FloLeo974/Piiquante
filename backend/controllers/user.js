// On importe les packages bcrypt et jsonwebtoken
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// On importe notre modèle mongoose pour les utilisateurs
const User = require('../models/User');

/****** FONCTION SIGNUP ******/
/* On crée une fonction qui permet à l'utilisateur s'enregistrer sur le site */
exports.signup = (req, res, next) => {
    // On appelle la fonction de hachage de bcrypt et on « sale » le mot de passe 10 fois
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // On crée un utilisateur en utilisant le hash généré pour le mot de passe
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // On enregistre l'utilisateur dans la base de données
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/****** FONCTION LOGIN ******/
/* On crée une fonction qui permet à l'utilisateur de se connecter avec ses identifiants,
** de vérifier que ceux-ci sont bien présents dans notre base de données
** et de lui fournir un token pour garantir son identité au cours de sa navigation */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        // On vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
        if (!user) {
            return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' });
        }
        // On vérifie que le mot de passe entré par l'utilisateur correspond au hash enregistré dans la base de données
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' });
            }
            // On renvoie une réponse contenant l'id utilisateur et un token
            res.status(200).json({
                userId: user._id,
                // On chiffre un token qui contient l'ID de l'utilisateur encodé.
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};