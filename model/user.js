const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
    if(err){
        console.error('Ocorreu um erro ao conectar ao mongoDB' + err);
        send.status(500); //INTERNAL SERVER ERROR
    }else{
        db = database.db('trainee-prominas');
        collection = db.collection('user');
        collection.find({}).toArray((err, user) =>{id = user.length + 1});
    }
});

function user() {};

user.prototype.getAllUsers = function (callback) {
    console.log('entrou model');

    collection.find({"status":1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}}).toArray((err, users) =>{
       callback(err, users);
    });
};

module.exports = function () {
    return user;
};