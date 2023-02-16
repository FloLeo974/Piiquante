// On crée notre middleware de validation des entrées email et password
module.exports = (req, res, next) => {
    const emailRegex = /^([A-Za-z0-9]+[_.]{0,1}[\w-]+)+@([a-z0-9]+[-]{0,1}[a-z0-9]+)+\.[a-z]{2,}([.]{0,1}[a-z]{2,})*$/
    // Password -> Requis: 6 à 12 caractères, au moins une minuscule, une majuscule et un chiffre // Interdit: signe égal et apostrophe
    const passwordRegex = /^(?!.*['=])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/
        if(! req.body.email.match(emailRegex)) {
            res.status(400).json({ error: "Email: format de saisie invalide" })
        }
        else {
            if(! req.body.password.match(passwordRegex)) {
                res.status(400).json({ error: "Password: format de saisie invalide" })
                }
                else {
                    next(); 
                }
            }
};