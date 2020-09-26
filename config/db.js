if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://kinzart:paixonix2787@mongo_dbsisteminha:27017/dbsisteminha"}
    console.log('mongodb online')
} else {
    module.exports = {mongoURI: "mongodb://localhost/blog"}
    console.log('mongodb local')
}
