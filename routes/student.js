const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;
var collectionCourse;

// const index = require('../index');
// var id = index.getIdStudent();
var id = 1;
var status = 1;


// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('student');
    collectionCourse = db.collection('course');
  }
});

// CRUD STUDENT COMPLETE

// CREATE STUDENT
router.post('/', function (req, res){ 
  var student = req.body;
  student.id = id++;
  (async () => {
    for(var i = 0; i < student.course.length; i++){
      let course = await _getOneCourse(student.course[i]);
        if(course == null){
          student.course.splice(i, 1);
          }else{
            student.course[i] = course; 
          }
    }
    if(student.course.length > 0){
      collection.insertOne(student, (err, result) => {
        if(err){
          console.error("Ocorreu um erro ao conectar a collection course");
          res.status(500).send("Erro ao cadastrar estudante");
        }else{
          res.status(201).send("Estudante cadastrado com sucesso!");
        }
      });
      }else{
      res.status(404).send('O curso inserido não foi encontrado');        
      }
  })();
});

// READ ALL STUDENTS
router.get('/', function (req, res){
  collection.find({}).toArray((err, students) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection student');
      send.status(500);
    }else{
      res.send(students);
    }
  });
});

// READ STUDENTS FILTERED
router.get('/:id', function (req, res){ 
  var id = parseInt(req.params.id);
  collection.find({"id": id}).toArray((err, student) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection student');
      send.status(500);
    }else{
      if(student === []){
        res.status(404).send('Estudante não encontrado');
      }else{
        res.send(student);        
      }
    }
  });
});

// UPDATE STUDENT
router.put('/:id', function (req, res){
  var id = req.params.id;
  var student = req.body;
  student.id = parseInt(id);
  if(student === {}){
    res.status(400).send('Solicitação não autorizada');
  }else{
    (async () => {
      for(let i = 0; i < student.course.length; i++){
        let course = await _getOneCourse(student.course[i]);
        if(course == null){
          student.course.splice(i, 1);
          }else{
            student.course[i] = course; 
          }
      }
      if(student.course.length > 0){
        collection.update({"id": parseInt(id)}, student, (err, result) => {
          if(err){
            console.error("Ocorreu um erro ao conectar a collection course");
            res.status(500).send("Erro ao editar estudante");
          }else{
            res.status(201).send("Estudante editado com sucesso!");
          }
        });
      }else{
        res.status(404).send('O curso inserido não foi encontrado');
      }
    })();
  }
});

// DELETE STUDENTS FILTERED
router.delete('/:id', function (req, res){ //DELETE FILTERED
  var id = parseInt(req.params.id);
  collection.deleteOne({"id": id}, true, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os estudantes da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('O estudante foi removido com sucesso');
        // res.status(204)
        res.send('O estudante foi removido com sucesso'); // no content
      }else{
        console.log('Nenhum estudante foi removido');
        res.status(404).send('Nenhum estudante foi removido');
      }
    }
  });
});

const _getOneCourse = (idCourse) => {
  return new Promise((resolve, reject) => {
    collectionCourse.findOne({"id": parseInt(idCourse)}, (err, course) =>{
      if(err){
        reject(err);
      }else{
        resolve(course);
      }
    });
  });
};

module.exports = router;