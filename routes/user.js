const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id;

// CONEXÃO AO MONGODB
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


// CRUD USER COMPLETED

// CREATE USER
router.post('/', function (req, res){
  if(req.body.name && req.body.lastName && req.body.profile){
    var user = {};
    user.id = id++; 
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.profile = req.body.profile;
    user.status = 1;
    collection.insert(user);
    res.status(201).send('Usuário cadastrado com sucesso!');
  }else{
    res.status(401).send('Não foi possível cadastrar o usuário');
  }
});

// READ ALL USERS
router.get('/', function (req, res){
  collection.find({"status":1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}}).toArray((err, users) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      res.send(users);
    }
  });
});

// READ USERS FILTERED
router.get('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.find({"id": id, "status":1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}}).toArray((err, user) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      if(user === []){
        res.status(404).send('Usuário não encontrado');
      }else{
        res.send(user);        
      }
    }
  });
});

// UPDATE USER
router.put('/:id', function (req, res){
  if(req.body.name && req.body.lastName && req.body.profile){
    var user = {};
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.profile = req.body.profile;
    collection.findOneAndUpdate({"id": parseInt(req.params.id), "status": 1}, {$set:{name: user.name, lastName: user.lastName, profile: user.profile}}, function (err, info){
      console.log(info.value == null);
      if(err){
        res.status(401).send('Não é possível editar usuário inexistente');
      }else{
    res.status(200).send('Usuário editado com sucesso!');
      }});
  }else{
    res.status(401).send('Não foi possível editar o usuário');
  }
});

// DELETE USERS FILTERED
router.delete('/:id', function (req, res){
  var id = req.params.id;
  collection.findOneAndUpdate({"id": parseInt(id), "status":1}, {$set: {status:0}}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      var numRemoved = info.value;
      if(numRemoved != null){
        console.log('O usuário foi removido');
        res.status(200).send('O usuário foi removido com sucesso');
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(204).send('Nenhum usuário foi removido');
      }
    }
  });
});

module.exports = router;