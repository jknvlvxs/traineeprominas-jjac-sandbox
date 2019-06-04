const teacherModel = require('../model/teacher');
const courseModel = require('../model/course');
const studentModel = require('../model/student');

exports.getAllTeachers = (req, res) => {
    let query = {'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

    teacherModel.getAll(query, projection)
    .then(teachers => {
        if(teachers.length == 0){
            res.status(404).send('Nenhum professor cadastrado');
        }else{
            res.send(teachers);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection teacher: ", err);
        res.status(500);
    });
}

exports.getFilteredTeacher = (req,res) => {
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

    teacherModel.getFiltered(query, projection)
    .then(teacher => {
        if(teacher.length == 0){
            res.status(404).send('O professor não foi encontrado');
        }else{
            res.send(teacher);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection teacher: ", err);
        res.status(500);
    });
}

exports.postTeacher = (req, res) => {
    if(req.body.name && req.body.lastName){
        let teacher = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
        };
        if(typeof req.body.phd == "boolean"){
            teacher.phd = req.body.phd;
        }
        teacher.status = 1;

        teacherModel.post(teacher)
        .then(result => {
            res.status(201).send('Professor cadastrado com sucesso!');
        })
        .catch(err => {
            console.error("Erro ao conectar a collection teacher: ", err);
            res.status(500);
        });
    }else{
        res.status(401).send('Não foi possível cadastrar o professor');
    }
}

exports.putTeacher = (req, res) => {
    if(req.body.name && req.body.lastName){
        let query = {'id': parseInt(req.params.id), 'status': 1};
        let set;
        if(req.body.phd != undefined){
        set = {id:parseInt(req.params.id), name:req.body.name, lastName:req.body.lastName, phd:req.body.phd, status:1};
        }else{
        set = {id:parseInt(req.params.id), name:req.body.name, lastName:req.body.lastName, status:1};
        }
        
        teacherModel.put(query, set)
        .then(async (result) => {
            if(result.value){
                res.status(201).send('Professor editado com sucesso!');
                await courseModel.updateTeacher(parseInt(req.params.id), set);
                courseModel.getCoursebyTeacher(parseInt(req.params.id)).then(courses => {
                    for (var i = 0; i<courses.length; i++){
                        studentModel.updateTeacher(courses[i]);
                      }
            });
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
}

exports.deleteTeacher = (req, res) => {
    let query = {'id': parseInt(req.params.id), 'status':1};
    let set = {status:0};

    teacherModel.delete(query, set)
    .then(result => {
        courseModel.deleteTeacher(parseInt(req.params.id));
        if(result.value){
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
}