const courseModel = require('../model/course');
const teacherModel = require('../model/teacher');

exports.getAllCourses = (req, res) => {
    let query = {status:1};
    let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

    courseModel.getAll(query, projection)
    .then(courses => {
        if(courses.length == 0){
            res.status(404).send('Nenhum curso cadastrado');
        }else{
            res.send(courses);        
        }
    })
    .catch(err => {
        console.error('Erro ao conectar a collection course:', err);
        res.status(500);
    });
}

exports.getFilteredCourse = (req,res) => {
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

    courseModel.getFiltered(query, projection)
    .then(course => {
        if(course.length == 0){
            res.status(404).send('O curso não foi encontrado');
        }else{
            res.send(course);        
        }
    })
    .catch(err => {
        console.error('Erro ao conectar a collection course:', err);
        res.status(500);
    });
}

exports.postCourse = (req, res) => {
    if(req.body.name && req.body.city){
        var course = {
            id:0,
            name:req.body.name,
            period:req.body.period || 8,
            city:req.body.city,
            teacher:req.body.teacher,
            status:1,
        };
    (async () => {
      if(course.teacher == undefined || course.teacher.length == 0){
        delete course.teacher;
      }else{
        for(let i = course.teacher.length-1; i > -1 ; i--){
          teacher = await teacherModel.getTeacher(course.teacher[i]);
          if(teacher == null){
            wrongInsert.unshift(course.teacher[i]);
            course.teacher.splice(i, 1);
          }else{
            course.teacher[i] = teacher[0]; 
          }
        }
      }
        courseModel.post(course)
        .then(result => {
            if(course.teacher != undefined){
                if(course.teacher.length > 0){
                  res.status(201).send('Curso cadastrado com sucesso!');            
                }else{
                  if(wrongInsert.length == 0){
                    res.status(201).send('O curso foi cadastrado com o sucesso, porém não lhe foi atribuído nenhum professor');
                  }else{
                    res.status(201).send('O curso foi cadastrado com o sucesso, porém o(s) professor(s) ' + wrongInsert+ ' não existe(m)');
                  }
                }
              }else{
                res.status(201).send('O curso foi cadastrado com o sucesso, porém não lhe foi atribuído nenhum professor');
              }
        })
        .catch(err => {
            console.error('Erro ao conectar a collection course:', err);
            res.status(500);
        });
    })();
    }else{
        res.status(401).send('Não foi possível cadastrar o curso');
    }
}

exports.putCourse = (req, res) => {
    if(req.body.name && req.body.lastName && req.body.profile){
        let query = {'id': parseInt(req.params.id),'status': 1};
        let set = {$set:{name: req.body.name, lastName: req.body.lastName, profile: req.body.profile}};
        
        courseModel.put(query, set)
        .then(result => {
            if(result.value){
                res.status(201).send('Curso editado com sucesso!');
            }else{
                res.status(401).send('Não é possível editar curso inexistente');
            }
        })
        .catch(err => {
            console.error('Erro ao conectar a collection course:', err);
            res.status(500);
        });
    }else{
        res.status(401).send('Não foi possível editar o curso');
    }
}

exports.deleteCourse = (req, res) => {
    let query = {'id': parseInt(req.params.id),'status':1};
    let set = {$set: {status:0}};

    courseModel.delete(query, set)
    .then(result => {
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
}