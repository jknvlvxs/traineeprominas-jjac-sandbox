const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;
var collectionTeacher;

var id = 1;
var status = 1;

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('course');
    collectionTeacher = db.collection('teacher');
  }
});

// CRUD COURSE COMPLETED

// CREATE COURSE
router.post('/', function(req, res){
  let course = req.body;
  course.id = id++;
  (async () => {
    for(let i = 0; i < course.teacher.length; i++){
      let teacher = await _getOneTeacher(course.teacher[i]);
      if(teacher == null){
       course.teacher.splice(i, 1);
       }else{
        course.teacher[i] = teacher; 
       }
    }
    collection.insertOne(course, (err, result) => {
      if(err){
        console.error("Ocorreu um erro ao conectar a collection teacher");
        res.status(500).send("Erro ao cadastrar curso");
      }else{
        res.status(201).send("Curso cadastrado com sucesso!");
      }
    });
  })();
});
  
// READ ALL COURSES
router.get('/', function (req, res){
  collection.find({}).toArray((err, courses) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection course');
      send.status(500);
    }else{
      res.send(courses);
    }
  });
});

// READ COURSES FILTERED
router.get('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.find({"id": id}).toArray((err, course) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection course');
      send.status(500);
    }else{
      if(course === []){
        res.status(404).send('Curso não encontrado');
      }else{
        res.send(course);        
      }
    }
  });
});
  
// UPDATE COURSE  
router.put('/:id', function (req, res){
  var id = req.params.id;
  var course = req.body;
  course.id = parseInt(id);
  if(course === {}){
    res.status(400).send('Solicitação não autorizada');
  }else{
    (async () => {
      for(let i = 0; i < course.teacher.length; i++){
        let teacher = await _getOneTeacher(course.teacher[i]);
        if(teacher == null){
         course.teacher.splice(i, 1);
         }else{
          course.teacher[i] = teacher; 
         }
      }
      collection.update({"id": parseInt(id)}, course, (err, result) => {
        if(err){
          console.error("Ocorreu um erro ao conectar a collection teacher");
          res.status(500).send("Erro ao editar curso");
        }else{
          res.status(201).send("Curso editado com sucesso!");            
        }
      });
    })();
  }
});

// DELETE ALL COURSES
router.delete('/', function (req, res){
  collection.deleteMany({}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os cursos da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('Todos os '+numRemoved+' cursos foram removidos');
        // res.status(204) // no content
        res.send('Todos os cursos foram removidos com sucesso');
      }else{
        console.log('Nenhum curso foi removido');
        res.status(404).send('Nenhum curso foi removido');
      }
    }
  });
});

// DELETE COURSES FILTERED
router.delete('/:id', function (req, res){ //DELETE FILTERED
  var id = parseInt(req.params.id);
  collection.deleteOne({"id": id}, true, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os cursos da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('O curso foi removido com sucesso');
        // res.status(204) // no content
        res.send('O curso foi removido com sucesso'); 
      }else{
        console.log('Nenhum curso foi removido');
        res.status(404).send('Nenhum cursos foi removido');
      }
    }
  });
});

const _getOneTeacher = (idTeacher) => {
  return new Promise((resolve, reject) => {
    collectionTeacher.findOne({"id": parseInt(idTeacher)}, (err, teacher) =>{
      if(err){
        reject(err);
      }else{
        resolve(teacher);
      }
    });
  });
};

module.exports = router;