const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
require("../models/Nft")
const Usuario = mongoose.model("usuarios")
const Nft = mongoose.model("nfts")
const { logado } = require("../helper/logado")
const { isAdmin } = require("../helper/isAdmin")

// Painel

router.get("/", logado, (req, res) => {
    Nft.find().lean().sort({tipo: "asc"}).then((nfts) => {
        res.render("painel/painel", {nfts: nfts})
    })
    
})

// Painel Usuário

    router.get("/marketplace", logado, (req, res) => {
        res.render("painel/marketplace")
    })

// Painel Admin    
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

    router.post("/deletar", logado, isAdmin, (req, res) => {
        Usuario.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Usuário excluído com sucesso!")
            res.redirect("/painel/controle")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar excluir o usuário!")
                res.redirect("/painel/controle")
        })
    })

    router.get("/criarNFT", logado, isAdmin, (req, res) => {
        res.render("painel/criarNFT")
    })

    router.post("/criarNFT", logado, isAdmin, (req, res) => {
        const novoNFT = new Nft({
            nome: req.body.nome,
            tipo: req.body.tipo,
            raridade: req.body.raridade,
            vida: req.body.vida,
            resistencia: req.body.resistencia,
            poder: req.body.poder,
            velocidade: req.body.velocidade
        })

        novoNFT.save().then(() => {
            req.flash("success_msg", "NFT criado com sucesso!")
            res.redirect("/painel/criarNFT")
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno ao tentar criar um NFT!")
            res.redirect("/painel/criarNFT")
        })
    })

module.exports = router