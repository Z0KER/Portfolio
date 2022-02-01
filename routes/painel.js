const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const { logado } = require("../helper/logado")
const { isAdmin } = require("../helper/isAdmin")

router.get("/", logado, (req, res) => {
    res.render("painel/painel")
})


router.get("/marketplace", logado, (req, res) => {
    res.render("painel/marketplace")
})

router.get("/controle", logado, isAdmin, (req, res) => {
    Usuario.find().lean().sort({isAdmin: "desc"}).then((usuarios) => {
        res.render("painel/controle", {usuarios: usuarios})
    })
    
})

router.post("/tornarADM", logado, isAdmin, (req, res) => {
    Usuario.findOne({_id: req.body.id}).then((usuario) => {
        usuario.isAdmin = 1
        usuario.save().then(() => {
            req.flash("success_msg", usuario.nome_usuario + " acaba de se tornar admin!")
            res.redirect("/painel/controle")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar tornar o usuário em admin!")
            res.redirect("/painel/controle")
        })
    })
})

router.post("/revogarADM", logado, isAdmin, (req, res) => {
    Usuario.findOne({_id: req.body.id}).then((usuario) => {
        usuario.isAdmin = 0
        usuario.save().then(() => {
            req.flash("success_msg", usuario.nome_usuario + " acaba de ter função admin revogada!")
            res.redirect("/painel/controle")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar revogar função admin do usuário!")
            res.redirect("/painel/controle")
        })
    })
})

router.post("/deletar", isAdmin, (req, res) => {
    Usuario.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Usuário excluído com sucesso!")
        res.redirect("/painel/controle")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar excluir o usuário!")
            res.redirect("/painel/controle")
    })
})

module.exports = router