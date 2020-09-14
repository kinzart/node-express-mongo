const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")

/*===========SETTINGS=============*/


//========= SESSION ==============//
    app.use(session({
       secret: "" ,
       resave: true,
       saveUninitialized: true
    }))


//========= PASSPORT ==========//
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

   

//============ MIDLEWARE FLASH ===============////var global
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg") 
        res.locals.error_msg = req.flash("error_msg") 
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next() 
    })




//=========== BODY PARSER =============//
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

//============ HANDLEBARS =============//
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');

//============ MONGOOSE ===============//
    mongoose.Promise = global.Promise;
    mongoose.connect(db.mongoURI).then(() =>{
        console.log("Mongo conectado@!")
    }).catch((err) => {
        console.log("Ops... deu ruim!   ===" + err)
    })

//============== PUBLIC =================//
    app.use(express.static(path.join( __dirname, "public")))

    app.use((req, res, next) => {
        console.log('Midleware working...')
        next()
    })



//=========== MAIN ROUTES// */prefixo*/ 
    app.use('/admin', admin)
    
    app.get('/', function(req, res, next){
        Postagem.find().lean().populate("categoria").sort({date: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Error no sistema, tente novamente")
            res.redirect("/404")
            next()    
        }) 
    })

app.get("/postagem/:slug", (req, res, next) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem){
            console.log("Deu boa!"),
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Erro")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
        next()    
    })
})


//============ slug POSTAGENS=================//
app.get("/categorias/:slug", (req, res, next) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){

            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar os posts")
                res.redirect("/")
            })
        }else{
            req.flash("error_msg", "Essa categoria nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Ops, deu um erro aqui" + err)
        res.redirect("/")
        next()
    })
    
})



//============CATEGORIAS==============//
app.get("/categorias", (req, res, next) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar")
        res.redirect("/")
        next()
    })

})




//========404 ERROR ROUTE=============//
app.get("/404", (req, res, next) => {
    res.send("Erro 404  " + err)
    next()
})


//============USUARIOS==============//
app.use('/admin', admin)
app.use('/usuarios', usuarios)


//===== LISTEN PORT ===========//
const PORT = process.env.PORT || 8081;
app.listen(PORT,() => {
    console.log('Server is running...in 8081')
} )