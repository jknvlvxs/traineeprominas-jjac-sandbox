const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id = 1;
var status = 1;

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB' + err);
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('user');
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
    user.status = status;

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
    user.id = req.params.id; 
    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.profile = req.body.profile;
    user.status = status;

    collection.findOneAndUpdate({"id": parseInt(req.params.id), "status": 1}, {$set:{name: user.name, lastName: user.lastName, profile: user.profile}}, function (err, info){
        console.log(info.value == null);
        if (err){
        res.status(401).send('Não é possível editar usuário inexistente');
      }else{
    res.status(200).send('Usuário editado com sucesso!');
      }
    });
  }else{
    res.status(401).send('Não foi possível editar o usuário');
  }

});

// DELETE ALL USERS
router.delete('/', function (req, res){
  collection.remove({}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('Todos os '+numRemoved+' usuários foram removidos');
        // res.status(204);
        res.send('Todos os usuários foram removidos com sucesso'); // no content
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(404).send('Nenhum usuário foi removido');
      }
    }
  });
});

// DELETE USERS FILTERED
router.delete('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.remove({"id": id}, true, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os usuários da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('Todos os '+numRemoved+' usuários foram removidos');
        // res.status(204); // no content
        res.send('O usuário foi removido com sucesso'); 
      }else{
        console.log('Nenhum usuário foi removido');
        res.status(404).send('Nenhum usuário foi removido');
      }
    }
  });
});

module.exports = router;