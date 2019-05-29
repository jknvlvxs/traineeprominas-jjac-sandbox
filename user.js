const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = "mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true";
var db;

var id = 1;
var users = [];

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {native_parser:true}, (err, database) => {
  if (err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
  db = database.db('trainee-prominas');
  }
});

// var collection = db.collection('user');

// CRUD USER COMPLETED

// CREATE USER
router.post('/', function (req, res) {
  var user = req.body;
  user['id']=id++;
  // users.push(user);
  db.collection('user').insert(user);

  res.send('Usuário cadastrado com sucesso!');
})

// READ ALL USERS
router.get('/', function (req, res) {
  // db.collection('user')
  res.send(users);
})

// READ USERS FILTERED
router.get('/:id', function (req, res) {
  var id = req.params.id;
  var filteredUser = users.filter((s) => {return s.id == id; });
  if (filteredUser.length >= 1){
    res.send(filteredUser[0]);
  }else{
  res.status(404).send('Usuário não encontrado');
  }
})

// UPDATE USER
router.put('/:id', function (req, res) {
  var id = req.params.id;
  for (var i = 0; i<users.length; i++){
    if (id == users[i]['id']){
      var user = req.body;
      users[i]['name']=user.name || users[i]['name'];
      users[i]['lastname']=user.lastname || users[i]['lastname'];
      users[i]['profile']=user.profile || users[i]['profile'];
      res.send('Usuário editado com sucesso!');
    }else if(i == users.length-1){
      res.status(404).send('Usuário não encontrado')
    }
  }
  if (users.length == 0){
    res.status(404).send('Nenhum usuário cadastrado')      
  }
})

// DELETE ALL USERS
router.delete('/', function (req, res) {
  users = [];
  res.send('Todos os usuários foram removidos com sucesso!');
})

// DELETE USERS FILTERED
router.delete('/:id', function (req, res) {
  var id = req.params.id;
  var deletedUser = users.filter((s) => {return s.id == id; });
  if (deletedUser.length < 1){
    res.status(404).send('Usuário não encontrado');
  }else{
    for (var i=0; i<users.length; i++){
      if (users[i]['id'] == id){
        users.splice(i, 1);
        res.send('Usuário removido com sucesso!');
      }
    }
  }
})

module.exports = router;