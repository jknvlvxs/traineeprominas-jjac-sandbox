const teacherModel = require('../model/teacher');
const courseModel = require('../model/course');
const studentModel = require('../model/student');

exports.getAllTeachers = (req, res) => {
    //  define query and projection for search
    let query = {'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

    // send to model
    teacherModel.getAll(query, projection)
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

exports.getFilteredTeacher = (req,res) => {
    //  define query and projection for search    
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

    // send to model
    teacherModel.getFiltered(query, projection)
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

exports.postTeacher = (req, res) => {
    // check required attributes    
    if(req.body.name && req.body.lastName){

        // creates teacher array to be inserted        
        let teacher = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
            phd:req.body.phd,
            status:1
        };
        
        // send to model
        teacherModel.post(teacher)
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
    }else{
        res.status(401).send('Não foi possível cadastrar o professor');
    }
};

exports.putTeacher = (req, res) => {
    // check required attributes
    if(req.body.name && req.body.lastName){

        //  define query and set for search and update    
        let query = {'id': parseInt(req.params.id), 'status': 1};
        let set = {id:parseInt(req.params.id), name:req.body.name, lastName:req.body.lastName, phd:req.body.phd, status:1};

        // send to model
        teacherModel.put(query, set)
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

exports.deleteTeacher = (req, res) => {
    //  define query and set for search and delete  
    let query = {'id': parseInt(req.params.id), 'status':1};
    let set = {status:0};

    // send to model
    teacherModel.delete(query, set)
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