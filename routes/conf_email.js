const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const { deslogado } = require("../helper/deslogado")
const bcrypt = require("bcryptjs")

// Ativar Conta
    router.get("/:codeAtivar", deslogado, (req, res) => {
        Usuario.findOne({codeAtivar: req.params.codeAtivar}).then((usuario) => {
            usuario.codeAtivar = null
            usuario.contaAtiva = 1
            usuario.resetar = null

            usuario.save().then(() => {
                req.flash("success_msg", "Conta confirmada com sucesso!")
                res.redirect("/usuarios/login")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao confirmar sua conta, favor entrar em contato com o suporte!")
                res.redirect("/usuarios/login")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao confirmar sua conta!")
            res.redirect("/usuarios/login")
        })
    })

// Recuperar Conta
    router.get("/recuperar/:recuperar_senha", deslogado, (req, res) => {
        Usuario.findOne({recuperarSenha: req.params.recuperar_senha}).lean().then((usuario) => {
            if(usuario) {
                res.render("usuarios/mudar_senha", {usuario: usuario})
            } else {
                req.flash("error_msg", "Não foi possível recuperar essa conta, tente novamente ou entre em contato com o suporte!")
                res.redirect("/usuarios/recuperar_senha")
            }
        })
    })

    router.post("/recuperar", deslogado, (req, res) => {
        Usuario.findOne({recuperarSenha: req.body.recuperar_senha}).then((usuario) => {
            if(usuario) {
                if(req.body.senha != req.body.confirm_senha || req.body.senha.length < 8 || req.body.confirm_senha.length < 8) {
                    req.flash("error_msg", "Favor preencher o formulário corretamente!")
                    res.redirect("/conf_email/recuperar/" + req.body.recuperar_senha)
                } else {
                    usuario.recuperarSenha = null
                    usuario.resetar = null
                    usuario.senha = req.body.senha
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(usuario.senha, salt, (erro, hash) => {
                            if(erro) {
                                req.flash("error_msg", "Houve um erro durante a alteração da senha!")
                                res.redirect("conf_email/recuperar/" + req.body.recuperar_senha)
                            } else {
                                usuario.senha = hash
                                usuario.save().then(() => {
                                    req.flash("success_msg", "Senha alterada com sucesso!")
                                    res.redirect("/usuarios/login")
                                }).catch((err) => {
                                    req.flash("error_msg", "Erro ao tentar alterar a senha, tente novamente ou entre em contato com o suporte")
                                    res.redirect("/conf_email/recuperar/" + req.body.recuperar_senha)
                                })
                            }
                        })
                    })
                }
            } else {
                req.flash("error_msg", "Não foi possível alterar a senha, tente novamente ou entre em contato com o suporte!")
                res.redirect("conf_email/recuperar/" + req.body.recuperar_senha)
            }
        })
    })

module.exports = router