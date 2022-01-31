const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    nome_usuario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    data_nascimento: {
        type: Date,
        required: true
    },
    pergunta: {
        type: Number,
        required: true
    },
    resposta: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Number,
        default: 0
    },
    contaAtiva: {
        type: Number,
        default: 0
    },
    codeAtivar: {
        type: String,
        unique: true
    },
    recuperarSenha: {
        type: String,
        unique: true
    },
    resetar: {
        type: Number
    }
})

mongoose.model("usuarios", Usuario)