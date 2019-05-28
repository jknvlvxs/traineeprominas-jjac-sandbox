const express = require('express');
const router = express.Router();
const arqCourse = require('./course');

var id = 0;

var students = [];

router.post('/', function (req, res) { //CREATE
    var student = req.body;
    student['id']=id++;
    for(var i = 0; i<student.course.length; i++){
        var idCourse = student.course[i];
        if(arqCourse.findbyId(idCourse)){
            student.course[i] = arqCourse.findbyId(idCourse);
            students.push(student);
    res.send('Estudante cadastrado com sucesso!');
        }else{
            res.send('O curso informado não existe!');
        }
    }
  })
  
  router.put('/:id', function (req, res) { //CREATE
    var id = req.params.id;
    for (var i=0; i<students.length; i++){
      if (id == students[i]['id']){
        var student = req.body;
        students[i]['name']= student.name || students[i]['name'];
        students[i]['lastname']= student.lastname || students[i]['lastname'];
        students[i]['age']= student.age || students[i]['age'];
        students[i]['course'] = student.course || students[i]['course']['id'];
        if(student.course){
          for(var j = 0; j<students[i].course.length; j++){
            var idCourse = students[i].course[j];
            if(arqCourse.findbyId(idCourse)){
              students[i].course[j] = arqCourse.findbyId(idCourse);
            }else{
              students[i].course[j] = '';
            }
        }
        }
      res.send('Estudante editado com sucesso!');
      }else if(i == students.length-1){
        res.status(404).send('Estudante não encontrado');
      }
    }
    if (students.length == 0){
      res.status(404).send('Nenhum estudante cadastrado')      
    }
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