const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario") //Call to here MODEL USUARIO.JS
const Usuario = mongoose.model("usuarios") // Atribuindo a const Usuario//recuperando
const bcrypt = require("bcryptjs")
const passport = require('passport')





router.get("/registro", (req, res, next) => {
    res.render("usuarios/registro")
    next()
})


//==========VALIDATION FORM ================//

router.post("/registro", (req, res,) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome de usúario inválido"})
    }
    
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({text: "E=mail inválido"})
    }
    
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({text: "Senha inválida"})
    }
    
    if(req.body.senha.length < 6){
        erros.push({text: "Senha muito curta..."})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({text: "As senhas não correspondem, tente novamente."})
    }
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{

        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse email em nosso sistema")
                res.redirect("/usuarios/registro")
            }else{
                //Objeto:
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    //eAdmin: 1
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Não foi possivel cadastrar o usuário")
                            res.redirect("/")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário cadastrado com sucesso!")
                            res.redirect("/")

                        }).catch((err) => {
                            req.flash("error_msg", "Hmm algo deu errado, tente novamente.")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Opa, ta errado..")
            res.redirect("/registro")
        })

    }
})

//======== LOGIN ===========//

router.get("/login", (req, res, next) => {
    res.render("usuarios/login")
    next()
})


router.post("/login", (req, res, next) =>{
   passport.authenticate("local", {
       successRedirect: "/",
       failureRedirect: "/usuarios/login",
       failureFlash: true
   })(req, res, next)
  
})


router.get("/logout", (req, res, next)=>{
    req.logout()
    req.flash("success_msg", "Thaw... até breve!")
    res.redirect("/")
    next()
})

module.exports = router