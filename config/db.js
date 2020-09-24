if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://kinzart:paixonix2787@mongo_dbsisteminha:27017/dbsisteminha', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true}
   
} else {
    module.exports = {mongoURI: "mongodb://localhost/blog"}
}
