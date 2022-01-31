module.exports = {
    logado: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            req.flash("error_msg", "Você precisa entrar em uma conta primeiro!")
            res.redirect("/usuarios/login")
        }
    }
}