if(process.env.NODE_ENV == "production"){
    module.exports = mongoURI: {"mongodb+srv://dbsis:Q5jA2ivCptiezdsQ@learningnode.upjrg.mongodb.net/dbsis?retryWrites=true&w=majority" {useNewUrlParser: true}}
   
} else {
    module.exports = {mongoURI: "mongodb://localhost/blog"}
}
