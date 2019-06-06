const studentModel = require('../model/student');
const courseModel = require('../model/course');

exports.getAllStudents = (req, res) => {
    //  define query and projection for search
    let query = {status:1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

    // send to model
    studentModel.getAll(query, projection)
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

exports.getFilteredStudent = (req,res) => {
    //  define query and projection for search
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

    // send to model
    studentModel.getFiltered(query, projection)
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

exports.postStudent = (req, res) => {
    // check required attributes
    if (req.body.name && req.body.lastName && req.body.age && req.body.course){

        // creates user array to be inserted
        var student = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
            age:req.body.age,
            course:req.body.course,
            status:1
        };

        (async () => {
            // receive the course related to the inserted id
            for(let i = 0; i < student.course.length; i++){
                let course = await courseModel.getCourse(student.course[i]);
                if(course.length > 0){ // if course exists
                    student.course[i] = course[0]; 
                  }else{
                    student.course.splice(i, 1);
                  }
            } 
          if(student.course.length > 0){ // verifies if the student is registered in a valid course
            
            // send to model
            studentModel.post(student)
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
        }
    })();
    }else{
        res.status(401).send('Não foi possível cadastrar o estudante');
    }
};

exports.putStudent = (req, res) => {
    //  define query for search    
    let query = {'id': parseInt(req.params.id), 'status': 1};

    // check required attributes
    if (req.body.name && req.body.lastName && req.body.age && req.body.course){

        // creates user array to update
        var student = {
            course:req.body.course
        };

        //  define set for update    
        let set = {name: req.body.name, lastName: req.body.lastName, age: req.body.age, course: student.course};

        (async () => {
          // receive the course related to the inserted id  
          for(let i = 0; i < student.course.length; i++){
            let course = await courseModel.getCourse(student.course[i]);
            
            if(course.length > 0){ // if course exists
                student.course[i] = course[0]; 
              }else{
                student.course.splice(i, 1);
              }
          }
          if(student.course.length > 0){// verifies if the student is registered in a valid course
            
            // send to model
            studentModel.put(query, set)
            .then(result => {
                if(result != false){
                    res.status(200).send('Estudante editado com sucesso!');
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
        })();
      }else{
      res.status(401).send('Não foi possível editar o estudante');
  
      }
};

exports.deleteStudent = (req, res) => {
    //  define query and set for search and delete    
    let query = {'id': parseInt(req.params.id), 'status':1};
    let set = {$set: {status:0}};

    // send to model
    studentModel.delete(query, set)
    .then(result => {
        if(result.value){ // if user exists
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