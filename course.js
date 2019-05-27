const express = require('express');
const router = express.Router();
const arqTeacher = require('./teacher');

var id = 0;

var courses = [];

router.post('/', function (req, res) { //CREATE
    
    var course = req.body;
    course['id']=id++;
    for(var i = 0; i<course.teacher.length; i++){
        var idTeacher = course.teacher[i];
        if(arqTeacher.findbyId(idTeacher)){
            course.teacher[i] = arqTeacher.findbyId(idTeacher);
        }else{
            course.teacher[i] = '';
        }
        
    }

    courses.push(course);
    res.send('Curso cadastrado com sucesso!');
  })
  
  router.get('/', function (req, res) { //READ ALL
    res.send(courses);
  })
  
  router.get('/:id', function (req, res) { //READ FILTERED
    var id = req.params.id;
    var filteredStudent = courses.filter((s) => {return s.id == id; });
    if (filteredStudent.length >= 1){
      res.send(filteredStudent[0]);
    } else{
      res.status(404).send('Curso não encontrado');
    }
  })
  
  router.delete('/', function (req, res) { //DELETE ALL
    courses = [];
    res.send('Todos os Cursos foram removidos com sucesso!');
  })

  router.delete('/:id', function (req, res) { //DELETE FILTERED
    var id = req.params.id;
    var deletedStudent = courses.filter((s) => {return s.id == id; });
    if (deletedStudent.length < 1){
    res.status(404).send('Curso não encontrado');
    } else{
      for (var i=0; i<courses.length; i++){
          if (courses[i]['id'] == id){
              courses.splice(i, 1);
              res.send('Curso removido com sucesso!');
          }
      }
    }
  })

    function findbyId(idCourse){
        idCourse = parseInt(idCourse);
        console.log(idCourse);
        for (var i = 0; i<courses.length; i++){
          if (idCourse == courses[i]['id']){
             return courses[i];
          }
        }
      } 

  module.exports = {router, findbyId}