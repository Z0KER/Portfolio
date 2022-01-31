if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://zoker:cyYvz4Fa4stnXdW9@cluster0.ymkxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/piratessailing"}
}