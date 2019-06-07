const database = require('../database');
const collection = database.getCollection('student');

var id;

(async () => {
  id = await collection.countDocuments({});
})();

exports.getAll = (res, query, projection) => {
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

exports.getFiltered = (res, query, projection) => {
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

exports.post = (res, student) => {
  // check required attributes
  if (student.name && student.lastName && student.age >= 17 && student.course.length == 1){
    student.id = ++id;    
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
};

exports.put = (res, query, student) => {
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

exports.delete = (res, query, set) => {
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