if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://dbsis:paixonix2787@learningnode.upjrg.mongodb.net/dbsis?retryWrites=true&w=majority"}
   
} else {
    module.exports = {mongoURI: "mongodb://localhost/blog"}
}