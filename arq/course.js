const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;
var collectionTeacher;

var id;

// connection to mongodb
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('course');
    collectionTeacher = db.collection('teacher');
    collectionStudent = db.collection('student');
    collection.find({}).toArray((err, course) =>{id = course.length + 1});
  }
});

// full course crud

// create course
router.post('/', function(req, res){
  var wrongInsert = [];
  let teacher;
  if (req.body.name && req.body.city){
    var course = {};
    course.id = id++;
    course.name = req.body.name;
    course.period = req.body.period || 8;
    course.city = req.body.city;
    course.teacher = req.body.teacher;
    course.status = 1;

    (async () => {
      console.log(course.teacher)
      if(course.teacher == undefined || course.teacher.length == 0){
        delete course.teacher;
      }else{
        for(let i = course.teacher.length-1; i > -1 ; i--){
          teacher = await _getOneTeacher(course.teacher[i]);
          if(teacher == null){
            wrongInsert.unshift(course.teacher[i]);
            course.teacher.splice(i, 1);
          }else{
            course.teacher[i] = teacher; 
          }
        }
      }
      
      collection.insertOne(course, (err, result) => {
        if(err){
          console.error('Ocorreu um erro ao conectar a collection teacher');
          res.status(500).send('Erro ao cadastrar curso');
        }else{
          if(course.teacher != undefined){
            if(course.teacher.length > 0){
              res.status(201).send('Curso cadastrado com sucesso!');            
            }else{
              if(wrongInsert.length == 0){
                res.status(201).send('O curso foi cadastrado com o sucesso, porém não lhe foi atribuído nenhum professor');
              }else{
                res.status(201).send('O curso foi cadastrado com o sucesso, porém o(s) professor(s) ' + wrongInsert+ ' não existe(m)');
              }
            }
          }else{
            res.status(201).send('O curso foi cadastrado com o sucesso, porém não lhe foi atribuído nenhum professor');
          }
        }
      });
    })();
  }else{
    res.status(401).send('Não foi possível cadastrar o curso');
  } 
});
  
// read all courses
router.get('/', function (req, res){
  collection.find({"status":1}, {projection: {_id:0, id: 1, name: 1, period: 1, city:1, "teacher.id":1, "teacher.name":1, "teacher.lastName":1, "teacher.phd":1}}).toArray((err, courses) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection course');
      send.status(500);
    }else{
      res.send(courses);
    }
  });
});

// read filtered course
router.get('/:id', function (req, res){
  collection.find({"id": parseInt(req.params.id), "status":1}, {projection: {_id:0, id: 1, name: 1, period: 1, city:1, "teacher.id":1, "teacher.name":1, "teacher.lastName":1, "teacher.phd":1}}).toArray((err, course) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection course');
      res.status(500);
    }else{
      if(course === []){
        res.status(404).send('Curso não encontrado');
      }else{
        res.send(course);        
      }
    }
  });
});
  
// update course
router.put('/:id', function (req, res){
  var wrongInsert = [];
  if(req.body.name && req.body.city){
    var course = {};
    course.id = parseInt(req.params.id);
    course.name = req.body.name;
    course.period = req.body.period || 8;
    course.city = req.body.city;
    course.teacher = req.body.teacher;
    course.status = 1;

    (async () => {
      for(let i = 0; i < course.teacher.length; i++){
        let teacher = await _getOneTeacher(course.teacher[i]);
        if(teacher == null){
          wrongInsert.unshift(course.teacher[i]);
         course.teacher.splice(i, 1);
         }else{
          course.teacher[i] = teacher; 
         }
      }
      
        collection.findOneAndUpdate({"id": parseInt(req.params.id), "status":1}, {$set: {...course}}, (err, result) => {
          collectionStudent.findOneAndReplace({"status":1, "course.id":parseInt(req.params.id)}, {$set: {"course.$": {...course}}}, (err, info) =>{
            if(err){
              console.log(err);
            }else{
              console.log("O curso foi atualizado em estudante");
            }
          });
          if(err){
            console.error("Ocorreu um erro ao conectar a collection teacher");
            res.status(500).send("Erro ao editar curso");
          }else{
            if(course.teacher != undefined){
              if(course.teacher.length > 0){
                res.status(201).send('Curso editado com sucesso!');            
              }else{
                if(wrongInsert.length == 0){
                  res.status(201).send('O curso foi editado com o sucesso, porém não lhe foi atribuído nenhum professor');
                }else{
                  res.status(201).send('O curso foi editado com o sucesso, porém o(s) professor(s) ' + wrongInsert+ ' não existe(m)');
                }
              }
            }else{
              res.status(201).send('O curso foi editado com o sucesso, porém não lhe foi atribuído nenhum professor');
            }       
          }
        });
    })();
  
  }else{
    res.status(401).send('Não foi possível editar o curso');
  }
    
});

// delete filtered course
router.delete('/:id', function (req, res){
  collection.findOneAndUpdate({"id":parseInt(req.params.id), "status":1}, {$set: {status:0}}, function (err, info){
    collectionStudent.findOneAndUpdate({"status":1, "course.id":parseInt(req.params.id)}, {$set: {status:0}}, (err, info) =>{
      if(err){
        console.log(err);
      }else{
        console.log("O curso foi deletado em estudante");
      }
    });
    if(err){
      console.error('Ocorreu um erro ao deletar os cursos da coleção');
      res.status(500);
    }else{
      if(info.value != null){
        console.log('O curso foi removido com sucesso');
        res.status(200).send('O curso foi removido com sucesso'); 
      }else{
        console.log('Nenhum curso foi removido');
        res.status(204);
      }
    }
  });
});

const _getOneTeacher = (idTeacher) => {
  return new Promise((resolve, reject) => {
    collectionTeacher.findOne({"id":parseInt(idTeacher), "status":1}, (err, teacher) =>{
      if(err){
        reject(err);
      }else{
        resolve(teacher);
      }
    });
  });
};

module.exports = router;