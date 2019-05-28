const express = require('express');
const router = express.Router();

var id = 1;
var teachers = []

// CRUD TEACHER COMPLETED

// CREATE TEACHER
router.post('/', function (req, res) {
  var teacher = req.body;
  teacher['id']= id++;
  teachers.push(teacher);
  res.send('Professor cadastrado com sucesso!');
})
  
// READ ALL TEACHERS
router.get('/', function (req, res) {
  res.send(teachers);
})

// READ TEACHERS FILTERED
router.get('/:id', function (req, res) {
  var id = req.params.id;
  var filteredteacher = teachers.filter((s) => {return s.id == id; });
  if (filteredteacher.length >= 1){
    res.send(filteredteacher[0]);
  }else{
    res.status(404).send('Professor não encontrado');
  }
})

// UPDATE TEACHER
router.put('/:id', function (req, res) {
  var id = req.params.id;
  for (var i = 0; i<teachers.length; i++){
    if (id == teachers[i]['id']){
      var teacher = req.body;
      teachers[i]['name']=teacher.name || teachers[i]['name'];
      teachers[i]['lastname']=teacher.lastname || teachers[i]['lastname'];
      teachers[i]['phd']=teacher.phd || teachers[i]['phd'];
      res.send('Professor editado com sucesso!');
    }else if(i == teachers.length-1){
      res.status(404).send('Professor não encontrado')
    }
  }
  if (teachers.length == 0){
    res.status(404).send('Nenhum professor cadastrado')      
  }
})

// DELETE ALL TEACHERS
router.delete('/', function (req, res) {
  teachers = [];
  res.send('Todos os professors foram removidos com sucesso!');
})

// DELETE TEACHERS FILTERED
router.delete('/:id', function (req, res) {
  var id = req.params.id;
  var deletedteacher = teachers.filter((s) => {return s.id == id; });
  if (deletedteacher.length < 1){
    res.status(404).send('Professor não encontrado');
  }else{
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