const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
require("../models/Suporte")
const Suporte = mongoose.model("suporte")
const Usuario = mongoose.model("usuarios")
const { logado } = require("../helper/logado")
const { isAdmin } = require("../helper/isAdmin")

// Suporte Usuário

    router.get("/", (req, res) => {
        res.render("suporte/suporte")
    })

    router.post("/", (req, res) => {
        const novoChamado = new Suporte({
            nome: req.body.nome,
            email: req.body.email,
            assunto: req.body.assunto.toUpperCase(),
            descricao: req.body.descricao
        })
        novoChamado.save().then(() => {
            req.flash("success_msg", "Solicitação enviada com sucesso!")
            res.redirect("/suporte")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao tentar solicitar suporte!")
            res.redirect("/suporte")
        })
    })

// Suporte Admin

    router.get("/chamados", logado, isAdmin, (req, res) => {
        Suporte.find().lean().sort({date: "asc"}).then((chamados) => {
            res.render("suporte/chamados", {chamados: chamados})
        })
        
    })

    router.post("/deletar", logado, isAdmin, (req, res) => {
        Suporte.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Chamado finalizado com sucesso!")
            res.redirect("/suporte/chamados")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar finalizar o chamado!")
                res.redirect("/suporte/chamados")
        })
    })

module.exports = router