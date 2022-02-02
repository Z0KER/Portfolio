// Carregando Módulos
    const express = require("express")
    const expbs = require("express-handlebars")
    const bodyParser = require("body-parser")
    const app = express()
    //const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    const usuarios = require("./routes/usuario")
    const painel = require("./routes/painel")
    const suporte = require("./routes/suporte")
    const conf_email = require("./routes/conf_email")
    const passport = require("passport")
    require("./config/auth")(passport)
    const db = require("./config/db")
    const { deslogado } = require("./helper/deslogado")
    require("dotenv").config()

// Configurações
    // Sessão
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })

    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    // Handlebars
        const hbs = expbs.create({
            defaultLayout: "main",
            layoutsDir: path.join(__dirname, 'views/layouts'),
            partialsDir: path.join(__dirname, 'views/partials'),

            // Crie Helpers Customizados
                helpers: {
                    isAdmin: function(object, options) {
                        let obj = object
                        
                        if(obj.isAdmin == 1) {
                            return options.fn(this)
                        }
                        return options.inverse(this)
                    },

                    dataLimite: function() {
                        let data = new Date()
                        let dia = String(data.getDate()).padStart(2, '0')
                        let mes = String(data.getMonth() + 1).padStart(2, '0')
                        let ano = data.getFullYear()
                        ano -= 15

                        let dataLimite = ano + '-' + mes + '-' + dia
                        return dataLimite
                    },

                    dataMin: function() {
                        let data = new Date()
                        let dia = String(data.getDate()).padStart(2, '0')
                        let mes = String(data.getMonth() + 1).padStart(2, '0')
                        let ano = data.getFullYear()
                        ano -= 110

                        let dataMin = ano + '-' + mes + '-' + dia
                        return dataMin
                    },

                    ifCompare: function(n, p, options) {
                        if(n == p) {
                            return options.fn(this)
                        }
                        return options.inverse(this)
                    }
                }
        })

        app.engine('handlebars', hbs.engine)
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        }).then(() => {
            console.log("Conectado ao MongoDB...")
        }).catch((err) => {
            console.log("Erro ao se conectar: " + err)
        })

    // Public
        app.use(express.static(path.join(__dirname, "public")))

// Rotas
    app.get("/", deslogado, (req, res) => {
        res.render("index")
    })

    app.use("/usuarios", usuarios)
    app.use("/conf_email", conf_email)
    app.use("/painel", painel)
    app.use("/suporte", suporte)

// Outros
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log("Servidor Iniciado...")
    })