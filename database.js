const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';

let db;

exports.connect = function() {
	return new Promise((resolve, reject) => {
    	mongoClient.connect(mdbURL, { useNewUrlParser: true }) //connect to mongodb
      	.then(connection => {
        	console.log("Conectado ao MongoDB!");
        	db = connection.db("trainee-prominas"); // db receive database
        	resolve();
     	})
      	.catch(err => {
        	console.error("Erro ao conectar ao MongoDB!", err);
        	reject(err);
      	});
  	});
};

exports.getCollection = function(name) { //return collection to model that require
  	return (db.collection(name));
};