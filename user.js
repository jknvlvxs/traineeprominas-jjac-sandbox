const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id = 1;
var users = [];

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {native_parser:true}, (err, database) => {
  if (err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
  db = database.db('trainee-prominas');
  collection = db.collection('user');
  }
});

// var collection = db.collection('user');

// CRUD USER COMPLETED

// CREATE USER
router.post('/', function (req, res) {
  var user = req.body;
  user['id']=id++;
  // users.push(user);
  collection.insert(user);

  res.send('Usuário cadastrado com sucesso!');
});

// READ ALL USERS
router.get('/', function (req, res) {
  db.collection('user').find({}).toArray((err, users) =>{
    if (err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      res.send(users);
    }
  });
});

// READ USERS FILTERED
router.get('/:id', function (req, res) {
  var id = parseInt(req.params.id);
  collection.find({'id': id}).toArray((err, user) =>{
    if (err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      if(user == []){
        res.status(404).send('Usuário não encontrado');
      }else{
        res.send(user);        
      }
    }
  });
});

// UPDATE USER
router.put('/:id', function (req, res) {
  var id = parseInt(req.params.id);
  var user = req.body;

  if(user == {}){
    res.status(400).send('Solicitação não autorizada');
  }else{
    collection.update({'id': id}, user);
    res.send('Usuário editado com sucesso!');
  }
});

// DELETE ALL USERS
router.delete('/', function (req, res) {
  collection.remove({}, function (err, info) {
    if (err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if (numRemoved > 0){
        console.log('Todos os '+numRemoved+' usuários foram removidos');
        res.status(204).send('Todos os usuários foram removidos com sucesso'); // no content
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(404).send('Nenhum usuário foi removido');
      }
    }
  });
})

// DELETE USERS FILTERED
router.delete('/:id', function (req, res) {
  var id = parseInt(req.params.id);
  collection.remove({"id": id}, true, function (err, info) {
    if (err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if (numRemoved > 0){
        console.log('Todos os '+numRemoved+' usuários foram removidos');
        res.status(204).send('Todos os usuários foram removidos com sucesso'); // no content
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(404).send('Nenhum usuário foi removido');
      }
    }
  });
})

module.exports = router;