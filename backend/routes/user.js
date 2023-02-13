// On importe express
const express = require('express');
// On crée un rooter express
const router = express.Router();

// On importe nos controllers pour les utilisateurs
const userCtrl = require('../controllers/user');
const validateInput = require('../middleware/validate-input');

// On crée nos routes et on indique les fonctions associées
router.post('/signup',validateInput, userCtrl.signup);
router.post('/login',validateInput, userCtrl.login);

// On exporte notre rooter express pour l'utiliser dans notre application
module.exports = router;