const express = require('express');
const router = express.Router();

const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;

var id = 1;

// CONEXÃO AO MONGODB
mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    // send.status(500); //INTERNAL SERVER ERROR
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('teacher');
  }
});

// CRUD TEACHER COMPLETED

// CREATE TEACHER
router.post('/', function (req, res){
  var teacher = req.body;
  teacher.id = id++;
  collection.insert(teacher);
  res.send('Professor cadastrado com sucesso!');
});
  
// READ ALL TEACHERS
router.get('/', function (req, res){
  collection.find({}).toArray((err, teachers) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection teacher');
      send.status(500);
    }else{
      res.send(teachers);
    }
  });
});

// READ TEACHERS FILTERED
router.get('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.find({"id": id}).toArray((err, teacher) =>{
    if(err){
      console.error('Ocorreu um erro ao conectar a collection teacher');
      send.status(500);
    }else{
      if(teacher === []){
        res.status(404).send('Professor não encontrado');
      }else{
        res.send(teacher);        
      }
    }
  });
});

// UPDATE TEACHER
router.put('/:id', function (req, res){
  var id = parseInt(req.params.id);
  var teacher = req.body;
  teacher.id = id;
  if(teacher === {}){
    res.status(400).send('Solicitação não autorizada');
  }else{
    collection.update({"id": id}, teacher);
    res.send('Professor editado com sucesso!');
  }
});

// DELETE ALL TEACHERS
router.delete('/', function (req, res){
  collection.remove({}, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os professores da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('Todos os '+numRemoved+' professores foram removidos');
        // res.status(204); // no content
        res.send('Todos os professores foram removidos com sucesso'); 
      }else{
        console.log('Nenhum professores foi removido');
        res.status(404).send('Nenhum professores foi removido');
      }
    }
  });
});

// DELETE TEACHERS FILTERED
router.delete('/:id', function (req, res){
  var id = parseInt(req.params.id);
  collection.remove({"id": id}, true, function (err, info){
    if(err){
      console.error('Ocorreu um erro ao deletar os professores da coleção');
      res.status(500);
    }else{
      var numRemoved = info.result.n;
      if(numRemoved > 0){
        console.log('Todos os '+numRemoved+' professores foram removidos');
        res.status(204).send('Todos os professores foram removidos com sucesso'); // no content
      }else{
        console.log('Nenhum professor foi removido');
        res.status(404).send('Nenhum professor foi removido');
      }
    }
  });
});

module.exports = router;