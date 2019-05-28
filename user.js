const express = require('express');
const router = express.Router();

var id = 0;

var users = [];

router.post('/', function (req, res) { //CREATE
    var user = req.body;
    user['id']=id++;
    users.push(user);
    res.send('Usuário cadastrado com sucesso!');
  })

  router.get('/', function (req, res) { //READ ALL
    res.send(users);
  })
  
  router.get('/:id', function (req, res) { //READ FILTERED
    var id = req.params.id;
    var filteredUser = users.filter((s) => {return s.id == id; });
    if (filteredUser.length >= 1){
      res.send(filteredUser[0]);
    } else{
      res.status(404).send('Usuário não encontrado');
    }
  })
  
  router.put('/:id', function (req, res) { //CREATE
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

  router.delete('/', function (req, res) { //DELETE ALL
    users = [];
    res.send('Todos os usuários foram removidos com sucesso!');
  })

  router.delete('/:id', function (req, res) { //DELETE FILTERED
    var id = req.params.id;
    var deletedUser = users.filter((s) => {return s.id == id; });
    if (deletedUser.length < 1){
    res.status(404).send('Usuário não encontrado');
    } else{
      for (var i=0; i<users.length; i++){
          if (users[i]['id'] == id){
              users.splice(i, 1);
              res.send('Usuário removido com sucesso!');
          }
      }
    }
  })

  module.exports = router;