const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Suporte = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    assunto: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
})

mongoose.model("suporte", Suporte)