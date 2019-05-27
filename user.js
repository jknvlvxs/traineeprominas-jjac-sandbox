const express = require('express');
const router = express.Router();

var id = 0;

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
  
  router.delete('/', function (req, res) { //DELETE ALL
    users = [];
    res.send('Todos os Usuários foram removidos com sucesso!');
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