const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id;

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('teacher');
    collectionCourse = db.collection('course');
    collectionStudent = db.collection('student');
    collection.find({}).toArray((err, teacher) =>{id = teacher.length + 1});
  }
});

// CRUD TEACHER COMPLETED

// CREATE TEACHER
router.post('/', function (req, res){
  if(req.body.name && req.body.lastName){
    var teacher = {};
    teacher.id = id++;
    teacher.name = req.body.name;
    teacher.lastName = req.body.lastName;
    if(req.body.phd && typeof req.body.phd == "boolean"){
      teacher.phd = req.body.phd;
    }
    teacher.status = 1;
    collection.insert(teacher);
    res.send('Professor cadastrado com sucesso!');
  }else{
    res.status(401).send('Não foi possível cadastrar o professor');
  }
});
  
// READ ALL TEACHERS
router.get('/', function (req, res){
  collection.find({'status':1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}}).toArray((err, teachers) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection teacher');
      send.status(500);
    }else{
      if(teachers.length == 0){
        res.status(404).send('Nenhum professor cadastrado');
      }else{
        res.send(teachers);        
      }
    }
  });
});

// READ TEACHERS FILTERED
router.get('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.find({"id": id, status:1}, {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}}).toArray((err, teacher) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection teacher');
      send.status(500);
    }else{
      if(teacher.length == 0){
        res.status(404).send('Professor não encontrado');
      }else{
        res.send(teacher);        
      }
    }
  });
});

// UPDATE TEACHER
router.put('/:id', function (req, res){
  if(req.body.name && req.body.lastName){
    var teacher = {};
    teacher.id = parseInt(req.params.id);
    teacher.name = req.body.name;
    teacher.lastName = req.body.lastName;
    if(req.body.phd != undefined){
      teacher.phd = req.body.phd;
    }else{
      delete teacher.phd;
    }
    teacher.status = 1;
    collection.findOneAndUpdate({"id": parseInt(req.params.id), "status": 1}, {$set: { ...teacher }}, { returnOriginal: false }, function (err, info){
      (async () => {
      //   await collectionStudent.updateMany({"status":1, "course.teacher.id":parseInt(req.params.id)}, {$set: {"course.teacher.$": {...teacher}}}, (err, info) =>{
      //     if(err){
      //       console.log(err);
      //     }else{
      //       console.log("O professor foi atualizado em estudante");
      //     }
      //   });
      
      //   await collectionCourse.updateMany({"status":1, "teacher.id":parseInt(req.params.id)}, {$set: {"teacher.$": {...teacher}}}, (err, info) =>{
      //   if(err){
      //     console.log(err);
      //   }else{
      //     console.log("O professor foi atualizado em curso");
      //   }
      // });
      var updateTeacher = info.value;
      
      try {
        await collectionCourse.updateMany(
          {"status":1, "teacher.id":parseInt(req.params.id)},
          {$set: {"teacher.$": updateTeacher}});

        var courses = await collectionCourse.find({"status":1, "teacher.id":parseInt(req.params.id)}).toArray();
        
        for (var i = 0; i<courses.length; i++){
          await collectionStudent.findOneAndReplace(
              {"status":1, "course.id":courses[i].id},
              {$set: {"course":courses[i]}});
        }



          // {$set: {"course":courses}});

        } catch(err){
          console.log(err);
        }

    })();
      if(err){
        console.log(err);
        res.status(401).send('Não é possível editar professor inexistente');
      }else{
    res.status(200).send('Professor editado com sucesso!');
      }});
  }else{
    res.status(401).send('Não foi possível editar o professor');
  }
});

// DELETE TEACHERS FILTERED
router.delete('/:id', function (req, res){
  collection.findOneAndUpdate({"id": parseInt(req.params.id), "status":1}, {$set: {status:0}}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os professores da coleção');
      res.status(500);
    }else{
      collectionCourse.findOneAndUpdate({"status":1}, {$pull: {"teacher": {id: parseInt(req.params.id)}}}, (err, info) =>{
        if(err){
          console.log(err);
        }else{
          console.log("O professor foi deletado em curso");
        }
      });
        collectionStudent.findOneAndUpdate({"status":1}, {$pull: {"course.teacher": {id: parseInt(req.params.id)}}}, (err, info) =>{
          if(err){
            console.log(err);
          }else{
            console.log("O professor foi deletado em estudante");
          }
      });
      if(info.value != null){
        console.log('O professor foi removido');
        res.status(200).send('O professor foi removido com sucesso');
      }else{
        console.log('Nenhum professor foi removido');
        res.status(204).send('Nenhum professor foi removido');
      }
    }
  });
});

module.exports = router;