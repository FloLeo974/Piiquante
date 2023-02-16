// On importe notre modèle mongoose pour les sauces
const Sauce = require('../models/sauce');
// On importe le package fs pour pouvoir modifier le sytème de fichiers
const fs = require('fs');

/****** FONCTION GET ALL SAUCE ******/
/* On crée une fonction qui renvoie un tableau contenant toutes les sauces de notre base de données 
** afin de les afficher */
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces)) // "sauces" est le collection des "sauce" dans la base de données MongoDB
    .catch(error =>  res.status(400).json({ error: error }));
};

/****** FONCTION GET ONE SAUCE ******/
/* On crée une fonction qui renvoie la sauce ayant l'id du paramètre de la requête
** afin de l'afficher */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error: error }));
};

/****** FONCTION CREATE SAUCE ******/
/* On crée une fonction qui permet de créer une instance de notre modèle sauce */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id renvoyé par le frontend
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
/* On crée une fonction qui permet au créateur d'une sauce d'en modifier les informations */
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
/* On crée une fonction qui supprime la sauce de la base de données 
** ainsi que le fichier dans notre dossier images */
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

/****** FONCTION LIKE OR DISLIKE SAUCE ******/
/* On crée une fonction qui permet de compter les likes et les dislikes pour chaque sauce
** et de mettre à jour le tableau des utilisateurs ayant likés ou dislikés dans notre base de données */
exports.likeOrDislikeSauce = (req, res, next) => {
    // On récupère la sauce dans la base de données
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        // Si l'utilisateur like
        if (req.body.like === 1){
            // S'il n'avait pas encore liké
            if (!sauce.usersLiked.includes(req.body.userId)){
                // On met à jour la sauce
                Sauce.updateOne({ _id: req.params.id },{
                    // Nombre de like: +1
                    $inc: { likes: 1 },
                    // Ajout de l'utilisateur au tableau des likes
                    $push: { usersLiked: req.body.userId }
                })
                .then(() => res.status(201).json({ message: "Like prise en compte" }))
                .catch(error => res.status(400).json(" error "));
            }
        }
        else {
            // Sinon si l'utilisateur ne vote pas (annule son vote)
            if (req.body.like === 0){
                // S'il avait liké
                if (sauce.usersLiked.includes(req.body.userId)){
                    // On met à jour la sauce
                    Sauce.updateOne({ _id: req.params.id },{
                        // Nombre de like: -1
                        $inc: { likes: -1 },
                        // Suppression de l'utilisateur dans le tableau des likes
                        $pull: { usersLiked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "Like annulé" }))
                    .catch(error => res.status(400).json(" error "));
                }
                // S'il avait disliké
                if (sauce.usersDisliked.includes(req.body.userId)){
                    // On met à jour la sauce
                    Sauce.updateOne({ _id: req.params.id },{
                        // Nombre de dislike: -1
                        $inc: { dislikes: -1 },
                        // Suppression de l'utilisateur dans le tableau des dislikes
                        $pull: { usersDisliked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "Dislike annulé" }))
                    .catch(error => res.status(400).json(" error "));
                }
            }
            // Sinon si l'utilisateur dislike
            else {
                if (req.body.like === -1){
                    // S'il n'avait pas encore disliké
                    if (!sauce.usersDisliked.includes(req.body.userId)){
                        // On met à jour la sauce
                        Sauce.updateOne({ _id: req.params.id },{
                            // Nombre de dislike: +1
                            $inc: { dislikes: 1 },
                            // Ajout de l'utilisateur dans le tableau des dislikes
                            $push: { usersDisliked: req.body.userId }
                        })
                        .then(() => res.status(201).json({ message: "Dislike prise en compte" }))
                        .catch(error => res.status(400).json(" error "));
                    }
                }
            }
        }
    })
    .catch(error => res.status(404).json({ error }));
  };
  