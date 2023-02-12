// On importe notre modèle mongoose pour les sauces
const Sauce = require('../models/sauce');
// On importe le package fs pour pouvoir modifier le sytème de fichiers
const fs = require('fs');

/****** FONCTION GET ALL SAUCE ******/
// On renvoye un tableau contenant toutes les sauces de notre base de données
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces)) // "sauces" est le collection des "sauce" dans la base de données MongoDB
    .catch(error =>  res.status(400).json({ error: error }));
};

/****** FONCTION GET ONE SAUCE ******/
// On renvoie la sauce ayant l'id du paramètre de la requête
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error: error }));
};

/****** FONCTION CREATE SAUCE ******/
// On crée une instance de notre modèle sauce en supprimant au préalable l'id renvoyé par le frontend
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // On supprime le champ _userId de la requête envoyée par le client car nous ne devons pas lui faire confiance
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        // On remplace le _userId supprimé par celui extrait du token par le middleware d’authentification
        userId: req.auth.userId,
        // On indique l'url complète de notre image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // On enregistre notre sauce dans la base de données
    sauce.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json( { error }))
};

/****** FONCTION MODIFY SAUCE ******/
exports.modifySauce = (req, res, next) => {
    // On récupère le contenu de la requête de 2 manières selon qu'elle contient un fichier ou pas
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // On supprime le champ _userId de la requête envoyée par le client afin d'éviter de changer le propriétaire
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        // On vérifie que le requérant est bien le propriétaire en comparant l'userId de la base et celui du token
        if (sauce.userId != req.auth.userId) { res.status(401).json({ message : 'Not authorized'})}
        else {
            // On met à jour la sauce en utilisant l'id de la requête pour configurer notre sauce avec le même _id qu'avant
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};

/****** FONCTION DELETE SAUCE ******/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // On vérifie que l’utilisateur qui a fait la requête de suppression est bien le propriétaire
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                // On récupère le nom du fichier
                const filename = sauce.imageUrl.split('/images/')[1];
                // On supprime le fichier du dossier images
                fs.unlink(`images/${filename}`, () => {
                    // On supprime la sauce également dans la base de données
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => res.status(500).json({ error }));
};



/* temporaire: a refaire en entier */
exports.likeOrDislikeSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'A faire !'})})
    .catch(error => { res.status(400).json( { error })})
  };
  