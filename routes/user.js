const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id;

// connection to mongodb
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

// full user crud

// create user
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

// read all users
router.get('/', function (req, res){
  collection.find({"status":1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}}).toArray((err, users) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      if(users.length == 0){
        res.status(404).send('Nenhum usuário cadastrado');
      }else{
        res.send(users);        
      }
    }
  });
});

// read filtered user
router.get('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.find({"id": id, "status":1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}}).toArray((err, user) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection user');
      send.status(500);
    }else{
      if(user.length == 0){
        res.status(404).send('Usuário não encontrado');
      }else{
        res.send(user);        
      }
    }
  });
});

// update user
router.put('/:id', function (req, res){
  if(req.body.name && req.body.lastName && req.body.profile){
    collection.findOneAndUpdate({"id": parseInt(req.params.id), "status": 1}, {$set:{name: req.body.name, lastName: req.body.lastName, profile: req.body.profile}}, function (err, info){
      if(err){
        res.status(401).send('Não é possível editar usuário inexistente');
      }else{
    res.status(200).send('Usuário editado com sucesso!');
      }});
  }else{
    res.status(401).send('Não foi possível editar o usuário');
  }
});

// delete filtered user
router.delete('/:id', function (req, res){
  collection.findOneAndUpdate({"id": parseInt(req.params.id), "status":1}, {$set: {status:0}}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      if(info.value != null){
        console.log('O usuário foi removido');
        res.status(200).send('O usuário foi removido com sucesso');
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(204);
      }
    }
  });
});

module.exports = router;