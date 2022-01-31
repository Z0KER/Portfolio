const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de Usuário
    require("../models/Usuario")
    const Usuario = mongoose.model("usuarios")

    module.exports = function(passport) {
        passport.use(new localStrategy({usernameField: 'usuario', passwordField: "senha"}, (nome_usuario, senha, done) => {
            Usuario.findOne({nome_usuario: nome_usuario}).then((usuario) => {
                if(!usuario) {
                    return done(null, false, {message: "Essa conta não existe!"})
                } else {
                    if(usuario.contaAtiva == 1 && usuario.codeAtivar == null){
                        bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                            if(batem) {
                                return done(null, usuario)
                            } else {
                                return done(null, false, {message: "Senha incorreta!"})
                            }
                        })
                    } else {
                        return done(null, false, {message: "Verifique seu E-mail para ativar sua conta!"})
                    }
                    
                }
            })
        }))

        passport.serializeUser((usuario, done) => {
            done(null, usuario.id)
        })

        passport.deserializeUser((id, done) => {
            Usuario.findById(id, (err, usuario) => {
                done(err, usuario)
            })
        })
    }