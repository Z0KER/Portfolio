module.exports = {
    isAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.isAdmin == 1) {
            return next()
        } else {
            req.flash("error_msg", "Você precisa ser um Admin para acessar essa página")
            res.redirect("/painel")
        }
    }
}