const studentModel = require('../model/student');
const courseModel = require('../model/course');

exports.getAllStudents = (req, res) => {
    let query = {status:1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

    studentModel.getAll(query, projection)
    .then(students => {
        if(students.length == 0){
            res.status(404).send('Nenhum estudante cadastrado');
        }else{
            res.send(students);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection student: ", err);
        res.status(500);
    });
}

exports.getFilteredStudent = (req,res) => {
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

    studentModel.getFiltered(query, projection)
    .then(student => {
        if(student.length == 0){
            res.status(404).send('O estudante não foi encontrado');
        }else{
            res.send(student);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection student: ", err);
        res.status(500);
    });
}

exports.postStudent = (req, res) => {
    if (req.body.name && req.body.lastName && req.body.age && req.body.course){
        var student = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
            age:req.body.age,
            course:req.body.course,
            status:1
        };
        (async () => {
          for(var i = 0; i < student.course.length; i++){
            let course = await courseModel.getCourse(student.course[i]);
              if(course == null){
                student.course.splice(i, 1);
                }else{
                  student.course[i] = course[0]; 
                }
          }
          if(student.course.length > 0){
            studentModel.post(student)
            .then(result => {
                res.status(201).send('Estudante cadastrado com sucesso!');
            })
            .catch(err => {
                console.error("Erro ao conectar a collection student: ", err);
                res.status(500);
            });
        }
    })();
    }else{
        res.status(401).send('Não foi possível cadastrar o estudante');
    }
}

exports.putStudent = (req, res) => {
    let query = {'id': parseInt(req.params.id), 'status': 1};

    if (req.body.name && req.body.lastName && req.body.age && req.body.course){

        var student = {};
        student.course = req.body.course;
    let set = {$set:{name: req.body.name, lastName: req.body.lastName, age: req.body.age, course: student.course}};

        (async () => {
          for(let i = 0; i < student.course.length; i++){
            let course = await courseModel.getCourse(student.course[i]);
            if(course == null){
              student.course.splice(i, 1);
              }else{
                student.course[i] = course[0]; 
              }
          }
          if(student.course.length > 0){
            studentModel.put(query, set)
            .then(result => {
                res.status(201).send('Estudante cadastrado com sucesso!');
            })
            .catch(err => {
                console.error("Erro ao conectar a collection student: ", err);
                res.status(500);
            });
        }
        })();
      }else{
      res.status(401).send('Não foi possível editar o estudante');
  
      }
}

exports.deleteStudent = (req, res) => {
    let query = {'id': parseInt(req.params.id), 'status':1};
    let set = {$set: {status:0}};

    studentModel.delete(query, set)
    .then(result => {
        if(result.value){
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
}