// On importe express
const express = require('express');

// On crée un rooter express
const router = express.Router();

// On importe nos middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// On importe nos controllers pour les sauces
const sauceCtrl = require('../controllers/sauce');

// On crée nos routes avec les middlewares à appliquer et les fonctions à associer
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);

// On exporte notre rooter express pour l'utiliser dans notre application
module.exports = router;