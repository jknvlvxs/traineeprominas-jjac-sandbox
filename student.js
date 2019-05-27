const express = require('express');
const router = express.Router();

var id = 0;

var students = [
    {"id": id++, "name": "Marcos","lastName": "da Silva", "age": "18", "course": "Administração"},
    {"id": id++, "name": "Pedro","lastName": "Souza", "age": "27", "course": "Advocacia"},
    {"id": id++, "name": "Lucas","lastName": "Pereira", "age": "20", "course": "Educação Física"}]

router.post('/', function (req, res) { //CREATE
    
    var student = req.body;
    student['id']=id++;

    students.push(student);
    res.send('Estudante cadastrado com sucesso!');
  })
  
  router.get('/', function (req, res) { //READ ALL
    res.send(students);
  })
  
  router.get('/:id', function (req, res) { //READ FILTERED
    var id = req.params.id;
    var filteredStudent = students.filter((s) => {return s.id == id; });
    if (filteredStudent.length >= 1){
      res.send(filteredStudent[0]);
    } else{
      res.status(404).send('Estudante não encontrado');
    }
  })
  
  router.delete('/', function (req, res) { //DELETE ALL
    students = [];
    res.send('Todos os estudantes foram removidos com sucesso!');
  })

  router.delete('/:id', function (req, res) { //DELETE FILTERED
    var id = req.params.id;
    var deletedStudent = students.filter((s) => {return s.id == id; });
    if (deletedStudent.length < 1){
    res.status(404).send('Estudante não encontrado');
    } else{
      for (var i=0; i<students.length; i++){
          if (students[i]['id'] == id){
              students.splice(i, 1);
              res.send('Estudante removido com sucesso!');
          }
      }
    }
  })

  module.exports = router;