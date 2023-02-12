// On importe le package multer
const multer = require('multer');

// On crée un dictionnaire de type MIME
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On indique à multer où enregistrer les fichiers entrants et sous quel nom
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // On utilise le nom d'origine, on remplace les espaces par des underscores et on ajoute l'extension
    // On incorpore un timestamp pour éviter les doublons
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// On exporte notre middleware pour l'utiliser dans nos routes sauces
module.exports = multer({storage: storage}).single('image');