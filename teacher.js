const express = require('express');
const router = express.Router();

var id = 0;

var teachers = [
    {"id": id++, "name": "Marcos","lastName": "da Silva", "phd": "true"},
    {"id": id++, "name": "Pedro","lastName": "Souza", "phd": "true"},
    {"id": id++, "name": "Lucas","lastName": "Pereira", "phd": "false"}]

router.post('/', function (req, res) { //CREATE
    var teacher = req.body;
    teacher['id']= id++;
    teachers.push(teacher);
    res.send('Professor cadastrado com sucesso!');
  })
  
  router.get('/', function (req, res) { //READ ALL
    res.send(teachers);
  })
  
  router.get('/:id', function (req, res) { //READ FILTERED
    var id = req.params.id;
    var filteredteacher = teachers.filter((s) => {return s.id == id; });
    if (filteredteacher.length >= 1){
      res.send(filteredteacher[0]);
    } else{
      res.status(404).send('Professor não encontrado');
    }
  })
  
  router.delete('/', function (req, res) { //DELETE ALL
    teachers = [];
    res.send('Todos os professors foram removidos com sucesso!');
  })

  router.delete('/:id', function (req, res) { //DELETE FILTERED
    var id = req.params.id;
    var deletedteacher = teachers.filter((s) => {return s.id == id; });
    if (deletedteacher.length < 1){
    res.status(404).send('Professor não encontrado');
    } else{
      for (var i=0; i<teachers.length; i++){
          if (teachers[i]['id'] == id){
              teachers.splice(i, 1);
              res.send('Professor removido com sucesso!');
          }
      }
    }
  })

  function findbyId(idTeacher){
    idTeacher = parseInt(idTeacher);
    for (var i = 0; i<teachers.length; i++){
      if (idTeacher == teachers[i]['id']){
         return teachers[i];
      }
    }
  } 
  module.exports = {router, findbyId}