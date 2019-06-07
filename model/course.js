const database = require('../database');
const collection = database.getCollection('course');
const studentModel = require('./student');


var id;

(async () => {
  id = await collection.countDocuments({});
})();

exports.getAll = (res, query, projection) => {
  return collection.find(query, projection).toArray()
  .then(courses => {
    if(courses.length > 0){
      res.status(200).send(courses);        
    }else{
      res.status(404).send('Nenhum curso cadastrado');
    }
  })
  .catch(err => {
    console.error('Erro ao conectar a collection course:', err);
    res.status(500);
  });
};

exports.getFiltered = (res, query, projection) => {
  return collection.find(query, projection).toArray()
  .then(course => {
    if(course.length > 0){
      res.status(200).send(course);        
    }else{
      res.status(404).send('O curso não foi encontrado');
    }
  })
  .catch(err => {
    console.error('Erro ao conectar a collection course:', err);
    res.status(500);
  });
};

exports.post = (res, course) => {
  // check required attributes 
  if(course.name && course.city && course.teacher.length >= 2){
    course.id = ++id;
    return collection.insertOne(course)
    .then(result => {
      if(result != false){
        res.status(201).send('Curso cadastrado com sucesso!');
      }else{
        res.status(401).send('Não foi possível cadastrar o curso (necessário pelo menos 2 professores)');
      }
    })
    .catch(err => {
      console.error('Erro ao conectar a collection course:', err);
      res.status(500);
    });
  }else{
    res.status(401).send('Não foi possível cadastrar o curso');
  }
};

exports.put = (res, query, course) => {
  // check required attributes
  if(course.name && course.city && course.period && course.teacher.length >= 2){
    return collection.findOneAndUpdate(query, {$set: course}, {returnOriginal:false} )
    .then(result => {
      // update course in student
      if(result != false){
        if(result.value){
          res.status(200).send('Curso editado com sucesso!');
          studentModel.updateCourse(parseInt(req.params.id), result.value);
        }else{
          res.status(401).send('Não é possível editar curso inexistente');
        }
      }else{
        res.status(401).send('Não foi possível editar o curso (necessário pelo menos 2 professores)');
      }
    })
    .catch(err => {
        console.error('Erro ao conectar a collection course:', err);
        res.status(500);
    });
  }else{
    res.status(401).send('Não foi possível editar o curso');
  }
};

exports.delete = (res, query, set) => {
  return collection.findOneAndUpdate(query, {$set: set})
  .then(result => {
    // delete course in student
    studentModel.deleteCourse(parseInt(req.params.id));
    if(result.value){
      console.log('O curso foi removido');
      res.status(200).send('O curso foi removido com sucesso');
    }else{
      console.log('Nenhum curso foi removido');
      res.status(204).send();
    }
  })
  .catch(err => {
    console.error('Erro ao conectar a collection course:', err);
    res.status(500);
  });
};

exports.getCourse = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
};

exports.updateTeacher = (id, set) => {
  return collection.updateMany({'teacher.id':id, 'status':1}, {$set: {'teacher.$':set}});
};

exports.deleteTeacher = (id) => {
  return collection.findOneAndUpdate({'status':1, 'teacher.id':id}, {$pull: {"teacher": {'id': id}}});
};

exports.getCoursebyTeacher = () => {
  return collection.find({"status":1}).toArray();
};