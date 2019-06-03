const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;
var collectionCourse;

// connection to mongodb
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('student');
    collectionCourse = db.collection('course');
    collection.find({}).toArray((err, student) =>{id = student.length + 1});
  }
});

// full student crud

// create student
router.post('/', function (req, res){ 
  if (req.body.name && req.body.lastName && req.body.age && req.body.course){
    var student = {};
    student.id = id++;
    student.name = req.body.name;
    student.lastName = req.body.lastName;
    student.age = req.body.age;
    student.course = req.body.course;
    student.status = 1;
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
  }else{
    res.status(401).send('Não foi possível cadastrar o estudante');
  }
});

// read all students
router.get('/', function (req, res){
  collection.find({"status":1},{projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}}).toArray((err, students) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection student');
      send.status(500);
    }else{
      res.send(students);
    }
  });
});

// read students filtered
router.get('/:id', function (req, res){ 
  collection.find({"id": parseInt(req.params.id), "status":1},{projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}}).toArray((err, student) =>{
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

// update student
router.put('/:id', function (req, res){
    if (req.body.name && req.body.lastName && req.body.age && req.body.course){
      var student = {};
      student.course = req.body.course;
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
          collection.update({"id": parseInt(req.params.id), "status":1}, {$set:{name: req.body.name, lastName: req.body.lastName, age: req.body.age, course: student.course}}, (err, result) => {
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
    }else{
    res.status(401).send('Não foi possível editar o estudante');

    }
    
});

// delete filtered student
router.delete('/:id', function (req, res){
  collection.findOneAndUpdate({"id":parseInt(req.params.id), "status":1}, {$set: {status:0}}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os estudantes da coleção');
      res.status(500);
    }else{
      if(info.value != null){
        console.log('O estudante foi removido com sucesso');
        res.status(200).send('O estudante foi removido com sucesso');
      }else{
        console.log('Nenhum estudante foi removido');
        res.status(204);
      }
    }
  });
});

const _getOneCourse = (idCourse) => {
  return new Promise((resolve, reject) => {
    collectionCourse.findOne({"id": parseInt(idCourse), "status":1}, (err, course) =>{
      if(err){
        reject(err);
      }else{
        resolve(course);
      }
    });
  });
};

module.exports = router;