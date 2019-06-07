const database = require('../database');
const collection = database.getCollection('student');
// 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var id;
(async () => {
  id = await collection.countDocuments({});
})();

var teacherSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  lastName: {type: String, required: true},
  phd: {type: Boolean, required: true, validate: [val => {return val == true}, 'É obrigatório o professor possuir phd']},
  status: {type: Number, required: true}
});

var courseSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  period: {type: Number, required: true},
  city: {type: String, required: true},
  teacher: {type:[teacherSchema], validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores']},
  status: {type: Number, required: true}
});

var studentSchema = new Schema({
  id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  lastName: {type: String, required: true},
  age: {type: Number, required: true, min:17},
  course: {type:[courseSchema], validate: [val => {return val.length >= 1}, 'É necessário pelo menos 1 curso']},
  status: {type: Number, required: true}
});

var Student = mongoose.model('Student', studentSchema);


exports.getAll = (req, res, query, projection) => {
    return collection.find(query, projection).toArray()
    .then(students => {
      if(students.length > 0){
          res.status(200).send(students);        
      }else{
          res.status(404).send('Nenhum estudante cadastrado');
      }
  })
  .catch(err => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
  });
};

exports.getFiltered = (req, res, query, projection) => {
    return collection.find(query, projection).toArray()
    .then(student => {
      if(student.length > 0){
          res.status(200).send(student);
      }else{
          res.status(404).send('O estudante não foi encontrado');
      }
  })
  .catch(err => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
  });
};

exports.post = (req, res) => {
  var student = new Student({id: ++id, name: req.body.name, lastName: req.body.name, age: req.body.age, course:req.body.course, status:1});
  student.validate(error =>{
    if(!error){
        return collection.insertOne(student)
        .then(result => {
          if(result != false){
              res.status(201).send('Estudante cadastrado com sucesso!');
          }else{
              res.status(401).send('Não foi possível cadastrar o estudante (idade ou curso inválido(s))');
          }
      })
      .catch(err => {
          console.error("Erro ao conectar a collection student: ", err);
          res.status(500);
      });
    }else{
        res.status(401).send('Não foi possível cadastrar o estudante');
      }
  })
};

exports.put = (req, res, query, student) => {
  // check required attributes
  if (student.name && student.lastName && student.age >= 17 && student.course.length == 1){
    return collection.findOneAndUpdate(query, {$set:student})
    .then(result => {
      if(result != false){
          if(result.value){
              res.status(200).send('Estudante editado com sucesso!'); 
          }else{
              res.status(401).send('Não é possível editar estudante inexistente');
          }
      }else{
          res.status(401).send('Não foi possível editar o estudante (idade ou curso inválido)');
      }
  })
  .catch(err => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
  });
  }else{
    res.status(401).send('Não foi possível editar o estudante');
  }
};

exports.delete = (req, res, query, set) => {
  return collection.findOneAndUpdate(query, set)
  .then(result => {
    if(result.value){ // if student exists
        console.log('O estudante foi removido');
        res.status(200).send('O estudante foi removido com sucesso');
      }else{
        console.log('Nenhum estudante foi removido');
        res.status(204).send();
      }
})
.catch(err => {
    console.error("Erro ao conectar a collection student: ", err);
    res.status(500);
});
};

exports.updateCourse = (id, set) => {
  return collection.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {"course.$": set}});
};

exports.deleteCourse = (id, set) => {
  return collection.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {status:0}});
};

exports.updateTeacher = (course) => {
  return collection.findOneAndUpdate({'status':1, 'course.id':course.id}, {$set: {'course.$':course}});
};

exports.clean = (res) =>{
  return collection.deleteMany({})
  .then(result => {
      res.status(204).send();
  })
  .catch(err => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
  });
}