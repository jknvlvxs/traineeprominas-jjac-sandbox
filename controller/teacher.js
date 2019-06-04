const teacherModel = require('../model/teacher');

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

// exports.putTeacher = (req, res) => {
//     if(req.body.name && req.body.lastName && req.body.profile){
//         let query = {'id': parseInt(req.params.id), 'status': 1};
//         let set = {$set:{name: req.body.name, lastName: req.body.lastName, profile: req.body.profile}};
        
//         TeacherModel.put(query, set)
//         .then(result => {
//             if(result.value){
//                 res.status(201).send('Usuário editado com sucesso!');
//             }else{
//                 res.status(401).send('Não é possível editar usuário inexistente');
//             }
//         })
//         .catch(err => {
//             console.error("Erro ao conectar a collection Teacher: ", err);
//             res.status(500);
//         });
//     }else{
//         res.status(401).send('Não foi possível editar o usuário');
//     }
// }

// exports.deleteTeacher = (req, res) => {
//     let query = {'id': parseInt(req.params.id), 'status':1};
//     let set = {$set: {status:0}};

//     TeacherModel.delete(query, set)
//     .then(result => {
//         if(result.value){
//             console.log('O usuário foi removido');
//             res.status(200).send('O usuário foi removido com sucesso');
//           }else{
//             console.log('Nenhum usuário foi removido');
//             res.status(204).send();
//           }
//     })
//     .catch(err => {
//         console.error("Erro ao conectar a collection Teacher: ", err);
//         res.status(500);
//     });
// }