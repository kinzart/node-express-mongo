const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")




//==========ROUTES===========//

router.get('/', eAdmin, function(req, res){
    res.render("admin/index")
})

router.get('/posts', eAdmin,function(req, res){
    res.send("Pagina de posts")
}), 



//===========GET DATA ON DB AND SHOW===============//

router.get("/categorias",  eAdmin,(req, res) => { //.sort() listando por ordem da data 'desc' decrescente...
    Categoria.find().sort({date: 'desc'}).then((categorias) => { //Listando as categorias e mostrando nessa url
    res.render("admin/categorias", {categorias: categorias.map(Categoria => Categoria.toJSON())})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    

})

router.get("/categorias/add", eAdmin, function(req, res){
    res.render("admin/addcategorias")
})



//============CATEGORIA VALIDATION =============//

router.post("/categorias/nova", eAdmin, (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({text: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({text: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{

    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar salvar, teste novamente!")
        res.redirect("/admin")
    })
  }
})

//=========UPDATE CATEGORIAS==============//

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
    })
    
})

router.post("/categorias/edit", eAdmin, (req, res) => {
    Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        
        categoria.save().then(() => {
            req.flash("success_msg", "Edição concluida com sucesso!")
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Ops... houve um erro, tente novamente")
        res.redirect("/admin/categorias")
    })
    
})
//============= DELETE CATEGORIA ====================//
router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro, tente novamente")
        res.redirect("/admin/categorias")
    })
})



//=========== POSTAGENS ROUTES =============//

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().lean()
    .populate("categoria")
    .sort({data:"desc"})
    .then((postagens) => {
     res.render("admin/postagens", {postagens: postagens}) 
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar carregar a lista de categorias" + err)
        res.redirect("/admin")
    })
    
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar, tente novamente")
        res.redirect("/admin")
    })
    
})



//=========== SAVING POSTS IN MONGO DB ================//
router.post("/postagens/nova", (req, res) => {
    //recebendo form
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({text: "Categoria invalida!"})
    }
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug:  req.body.slug,
            descricao: req.body.descricao,
            conteudo:  req.body.conteudo,
            categoria:  req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem armazenada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Ops, rolou algum erro ai, tente novamente!")
            res.redirect("/admin")
        })
    }
})

//============ EDIT POSTAGENS ===============//

router.get("/postagens/edit/:id", (req, res) => {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => { //Pesquisando por uma (postagem) no db
        Categoria.find().lean().then((categorias) => { //Pesquisando por uma (categoria)
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem}) // Renderizando todos os dados
        }).catch((err) => {
            req.flash("error_msg", "Erro ao tentar listar a categoria" + err)
            res.redirect("/admin/postagens")
        })
        
    }).catch((err) => {
        req.flash("error_msg", "Esta postagem não existe")
        res.redirect("/admin/postagens")
    })
    
})


//=============UPDATE POSTAGEM=============//

router.post("/postagem/edit", (req, res) => {
    Postagem.findOne({_id:req.body.id}).lean().then((postagem) => {
        postagem.nome = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria
        
        postagem.save().then(() => {

        
        req.flash("success_msg", "Edição concluida com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Ops... houve um erro, tente novamente")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Ops... houve um erro ao salvar a edição, tente novamente")
        res.redirect("/admin/postagens")
    })
    
})




//===========DELETE POSTS (ALTERNATIVE WAY)==========//

router.get("/postagens/deletar/:id", (req, res) => {
    Postagem.remove({_id: req.params.id}).lean().then(() => {
        console.log("Deu boa!")
        req.flash("success_msg", "Diga adeus a sua postagem, Post deletado!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Erro interno")
        res.redirect("admin/postagens")
    })
})






//========= EXPORTING ROUTES ==============//
module.exports = router // ----> Will be getting:
                        // const admin = require("./routes/admin") in app.js