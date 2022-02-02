const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Nft = new Schema({
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        required: true
    },
    raridade: {
        type: Number,
        required: true
    },
    vida: {
        type: Number,
        required: true
    },
    resistencia: {
        type: Number,
        required: true
    },
    poder: {
        type: Number,
        required: true
    },
    velocidade: {
        type: Number,
        required: true
    }
})

mongoose.model("nfts", Nft)