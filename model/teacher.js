const database = require('../database');
const collection = database.getCollection('teacher');
const courseModel = require('../model/course');
const studentModel = require('../model/student');

var id;

(async () => {
     id = await collection.countDocuments({});
})();

exports.getAll = (res, query, projection) => {
  return collection.find(query, projection).toArray()
  .then(teachers => {
    if(teachers.length > 0){
        res.status(200).send(teachers);        
    }else{
        res.status(404).send('Nenhum professor cadastrado');
    }
  })
  .catch(err => {
      console.error("Erro ao conectar a collection teacher: ", err);
      res.status(500);
  });
};

exports.getFiltered = (res, query, projection) => {
  return collection.find(query, projection).toArray()
  .then(teacher => {
    if(teacher.length > 0){
        res.status(200).send(teacher);        
    }else{
        res.status(404).send('O professor não foi encontrado');
    }
  })
  .catch(err => {
      console.error("Erro ao conectar a collection teacher: ", err);
      res.status(500);
  });
};

exports.post = (res, teacher) => {
  // check required attributes    
  if (teacher.name && teacher.lastName && teacher.phd == true){
    teacher.id = ++id;
    return collection.insertOne(teacher);  
  }else{
    res.status(401).send('Não foi possível cadastrar o professor')
    .then(result => {
      if(result != false){
          res.status(201).send('Professor cadastrado com sucesso!');
      }else{
          res.status(401).send('Não foi possível cadastrar o professor (phd inválido)');
      }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection teacher: ", err);
        res.status(500);
    });
  }
};

exports.put = (res, query, teacher) => {
  // check required attributes
  if(teacher.name && teacher.lastName && teacher.phd == true){
    return collection.findOneAndUpdate(query, {$set: teacher}, {returnOriginal:false})
    .then(async (result) => {
      if(result.value){ // if professor exists
          if(result != false){
              res.status(200).send('Professor editado com sucesso!');

            //  updates the course that contains this teacher
            await courseModel.updateTeacher(parseInt(req.params.id), result.value);

          // receives the updated teacher and updates the student that contains this teacher
          courseModel.getCoursebyTeacher().then(courses => {
              for(var i = 0; i<courses.length; i++){
                  studentModel.updateTeacher(courses[i]);
                }
      });
          }else{
              res.status(401).send('Não foi possível editar o professor (phd inválido)');
          }
      }else{
          res.status(401).send('Não é possível editar professor inexistente');
      }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection teacher: ", err);
        res.status(500);
    });
  }else{
    res.status(401).send('Não foi possível editar o professor');
  }
};

exports.delete = (res, query, set) => {
  return collection.findOneAndUpdate(query, {$set: set})
  .then(async (result) => {
    //  updates the course that contains that teacher
    await courseModel.deleteTeacher(parseInt(req.params.id));
    
    // receives the updated teacher and updates the student that contains this teacher
    courseModel.getCoursebyTeacher().then(courses => {
        for(var i = 0; i<courses.length; i++){
            studentModel.updateTeacher(courses[i]);
        }
    });
    
    if(result.value){ // if professor exists
        console.log('O professor foi removido');
        res.status(200).send('O professor foi removido com sucesso');
      }else{
        console.log('Nenhum professor foi removido');
        res.status(204).send();
      }
})
.catch(err => {
    console.error("Erro ao conectar a collection teacher: ", err);
    res.status(500);
});
};

exports.getTeacher = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
};