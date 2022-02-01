const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const { deslogado } = require("../helper/deslogado")
const cron = require("node-cron")

// Cron
    cron.schedule("* * * * * *", () => {
        let data = new Date()
        let minuto = data.getMinutes()
        Usuario.findOne({resetar: minuto}).then((usuario) => {
            if(usuario) {
                if(usuario.codeAtivar && usuario.resetar == minuto) {
                    usuario.remove()
                }

                if(usuario.recuperarSenha && usuario.resetar == minuto && !usuario.codeAtivar) {
                    usuario.recuperarSenha = null
                    usuario.resetar = null
                    usuario.save()
                }
            }
        }).catch((err) => {

        })
        
    })

// Registro
    router.get("/registro", deslogado, (req, res) => {
        res.render("usuarios/registro")
    })

    router.post("/registro", deslogado, (req, res) => {
        let erros
        let data = new Date()
        let dia = String(data.getDate()).padStart(2, '0')
        let mes = String(data.getMonth() + 1).padStart(2, '0')
        let ano = data.getFullYear()
        let anoLimite = ano - 15

        let dataLimite = ano + '-' + mes + '-' + dia
        let dataInserida = req.body.data_nasc
        dataInserida = new Date(dataInserida)
        let anoInserido = dataInserida.getFullYear()
        let diaInserido = String(dataInserida.getDate()).padStart(2, '0')
        diaInserido++
        let mesInserido = String(dataInserida.getMonth() + 1).padStart(2, '0')
        let dataErrada = false

        if(mesInserido < 13 && mesInserido > 0 && anoInserido <= anoLimite) {
            if(mesInserido == mes && diaInserido > dia && anoInserido == anoLimite) {
                dataErrada = true
            } else if(mesInserido > mes && anoInserido == anoLimite) {
                dataErrada = true
            }
        } else {
            dataErrada = true
        }

        let anoDif = anoLimite - anoInserido

        if(anoDif > 110 || anoLimite < anoInserido) {
            dataErrada = true
        }
        
        if(!req.body.nome || !req.body.usuario || !req.body.email || !req.body.data_nasc || !req.body.pergunta || !req.body.resposta || !req.body.senha || !req.body.confirm_senha || req.body.senha != req.body.confirm_senha || req.body.senha.length < 8 || req.body.confirm_senha < 8 || dataErrada == true) {
            erros = "Preencha o formulário corretamente!"
        } 

        if(erros) {
            req.flash("error_msg", erros)
            res.redirect("/usuarios/registro")
        } else {
            Usuario.findOne({email: req.body.email}).then((usuario) => {
                if(usuario) {
                    req.flash("error_msg", "Já existe uma conta cadastrada neste e-mail!")
                    res.redirect("/usuarios/registro")
                } else {
                    Usuario.findOne({nome_usuario: req.body.usuario}).then((usuario) => {
                        if(usuario) {
                            req.flash("error_msg", "Já existe uma conta cadastrada com este nome de usuário!")
                            res.redirect("/usuarios/registro")
                        } else {
                            data_inicio = new Date()
                            minuto_fim = data_inicio.getMinutes() + 10
                            if(minuto_fim > 60) {
                                minuto_fim -= 60
                            }
                            const novoUsuario = new Usuario({
                                nome: req.body.nome,
                                nome_usuario: req.body.usuario,
                                email: req.body.email,
                                data_nascimento: req.body.data_nasc,
                                pergunta: req.body.pergunta,
                                resposta: req.body.resposta,
                                senha: req.body.senha,
                                codeAtivar: crypto.randomBytes(20).toString("hex"),
                                resetar: minuto_fim
                            })
                            bcrypt.genSalt(10, (erro, salt) => {
                                bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                    if(erro) {
                                        req.flash("error_msg", "Houve um erro durante o cadastro da conta!")
                                        res.redirect("/usuarios/registro")
                                    } else {
                                        novoUsuario.senha = hash
                                        novoUsuario.save().then(() => {
                                            let transporter = nodemailer.createTransport({
                                                host: "smtp.gmail.com",
                                                port: 465,
                                                secure: true,
                                                auth: {
                                                    user: "piratessailing.sendmail@gmail.com",
                                                    pass: "c:D*^3rH)J54p{@?"
                                                }
                                            })
                                            transporter.sendMail({
                                                from: "Pirates Sailing <piratessailing.sendmail@gmail.com>",
                                                to: novoUsuario.email,
                                                subject: "Cofirmação de Conta",
                                                html: "<h1>Deseja ativar sua conta?<br>Se sim, <a href='http://localhost:8000/conf_email/" + novoUsuario.codeAtivar + "'>Clique Aqui!</a></h1>"
                                            }).then(() =>{
                                                req.flash("success_msg", "Conta criada com sucesso, para ativar sua conta, verifique seu E-mail!")
                                                res.redirect("/usuarios/login")
                                            }).catch((err) => {
                                                console.log(err)
                                                req.flash("error_msg", "Houve um erro ao enviar a confirmação de conta, favor entrar em contato com o suporte!")
                                                res.redirect("/usuarios/registro")
                                            })
        
                                            
                                        }).catch((err) => {
                                            console.log(err)
                                            req.flash("error_msg", "Houve um erro ao cadastrar, tente novamente!")
                                            res.redirect("/usuarios/registro")
                                        })
                                    }
                                })
                            })
                        }
                    }) 
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao tentar cadastrar!")
                res.redirect("/")
            })
        }
    })

// Login
    router.get("/login", deslogado, (req, res) => {
        res.render("usuarios/login")
    })

    router.post("/login", deslogado, (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/painel",
            failureRedirect: "/usuarios/login",
            failureFlash: true
        })(req, res, next)
    })

// Logout

    router.get("/logout", (req, res) => {
        req.logout()
        res.redirect("/")
    })

// Recuperar Senha

    router.get("/recuperar_senha", deslogado, (req, res) => {
        res.render("usuarios/recuperar_senha")
    })

    router.post("/recuperar_senha", deslogado, (req, res) => {
        let erros
        let data = new Date()
        let dia = String(data.getDate()).padStart(2, '0')
        let mes = String(data.getMonth() + 1).padStart(2, '0')
        let ano = data.getFullYear()
        let anoLimite = ano - 15

        let dataLimite = ano + '-' + mes + '-' + dia
        let dataInserida = req.body.data_nasc
        dataInserida = new Date(dataInserida)
        let anoInserido = dataInserida.getFullYear()
        let diaInserido = String(dataInserida.getDate()).padStart(2, '0')
        diaInserido++
        let mesInserido = String(dataInserida.getMonth() + 1).padStart(2, '0')
        let dataErrada = false

        if(mesInserido < 13 && mesInserido > 0 && anoInserido <= anoLimite) {
            if(mesInserido == mes && diaInserido > dia && anoInserido == anoLimite) {
                dataErrada = true
            } else if(mesInserido > mes && anoInserido == anoLimite) {
                dataErrada = true
            }
        } else {
            dataErrada = true
        }

        let anoDif = anoLimite - anoInserido

        if(anoDif > 110 || anoLimite < anoInserido) {
            dataErrada = true
        }

        if(!req.body.usuario || !req.body.email || !req.body.data_nasc || !req.body.pergunta || !req.body.resposta || dataErrada == true) {
            erros = "Preencha o formulário corretamente!"
        } 

        if(erros) {
            req.flash("error_msg", erros)
            res.redirect("/usuarios/recuperar_senha")
        } else {
            Usuario.findOne({nome_usuario: req.body.usuario, email: req.body.email, data_nascimento: req.body.data_nasc, pergunta: req.body.pergunta, resposta: req.body.resposta}).then((usuario) => {
                if(usuario) {
                    if(usuario.contaAtiva == 1) {
                        usuario.recuperarSenha = crypto.randomBytes(20).toString("hex")
                        data_inicio = new Date()
                        minuto_fim = data_inicio.getMinutes() + 10
                        if(minuto_fim > 60) {
                            minuto_fim -= 60
                        }
                        usuario.resetar = minuto_fim
                        usuario.save().then(() => {
                            let transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 465,
                                secure: true,
                                auth: {
                                    user: "piratessailing.sendmail@gmail.com",
                                    pass: "c:D*^3rH)J54p{@?"
                                }
                            })
                            transporter.sendMail({
                                from: "Pirates Sailing <piratessailing.sendmail@gmail.com>",
                                to: usuario.email,
                                subject: "Recuperação de Senha",
                                html: "<h1>Deseja recuperar sua senha?<br>Se sim, <a href='http://localhost:8000/conf_email/recuperar/" + usuario.recuperarSenha + "'>Clique Aqui!</a></h1>"
                            }).then(() =>{
                                req.flash("success_msg", "Verificação de conta enviada para o seu E-mail!")
                                res.redirect("/usuarios/login")
                            }).catch((err) => {
                                console.log(err)
                                req.flash("error_msg", "Houve um erro ao enviar a verificação de conta, favor entrar em contato com o suporte!")
                                res.redirect("/usuarios/recuperar_senha")
                            })
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao tentar recuperar sua conta, tente novamente!")
                            res.redirect("/usuarios/recuperar_senha")
                        })
                    } else {
                        data_inicio = new Date()
                        minuto_fim = data_inicio.getMinutes() + 10
                        if(minuto_fim > 60) {
                            minuto_fim -= 60
                        }
                        usuario.resetar = minuto_fim
                        usuario.codeAtivar = crypto.randomBytes(20).toString("hex")
                        usuario.save().then(() => {
                            let transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 465,
                                secure: true,
                                auth: {
                                    user: "piratessailing.sendmail@gmail.com",
                                    pass: "c:D*^3rH)J54p{@?"
                                }
                            })

                            transporter.sendMail({
                                from: "Pirates Sailing <piratessailing.sendmail@gmail.com>",
                                to: usuario.email,
                                subject: "Cofirmação de Conta",
                                html: "<h1>Deseja ativar sua conta?<br>Se sim, <a href='http://localhost:8000/conf_email/" + usuario.codeAtivar + "'>Clique Aqui!</a></h1>"
                            }).then(() =>{
                                req.flash("error_msg", "Você precisa ativar sua conta antes, verifique seu E-mail!")
                                res.redirect("/usuarios/login")
                            }).catch((err) => {
                                console.log(err)
                                req.flash("error_msg", "Houve um erro ao enviar a verificação de conta, favor entrar em contato com o suporte!")
                                res.redirect("/usuarios/login")
                            })
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao tentar ativar sua conta, tente novamente ou entre em contato com o suporte!")
                            res.redirect("/usuarios/login")
                        })
                    }

                } else {
                    req.flash("error_msg", "Os dados informados no formulário estão incorretos!")
                    res.redirect("/usuarios/recuperar_senha")
                }
            })
        }
    })

module.exports = router