module.exports = {
    deslogado: function(req, res, next) {
        if(!req.isAuthenticated()) {
            return next()
        } else {
            req.flash("error_msg", "Você precisa sair da sua conta primeiro!")
            res.redirect("/painel")
        }
    }
}