const mongoose = require('mongoose')
const Schema = mongoose.Schema


//=========Definindo Schema=========//
const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0 //Não é admin 0 é false
    }
,
    senha:{
        type: String,
        required: true
    } 
   
})


mongoose.model("usuarios", Usuario)