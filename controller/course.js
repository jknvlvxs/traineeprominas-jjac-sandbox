const courseModel = require('../model/course');
const teacherModel = require('../model/teacher');
const studentModel = require('../model/student');

exports.getAllCourses = (req, res) => {
    //  define query and projection for search
    let query = {status:1};
    let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

    // send to model
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
    //  define query and projection for search
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

    // send to model
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
    // wrongInsert contains the invalid ids entered
    var wrongInsert = [];

    // check required attributes 
    if(req.body.name && req.body.city){

        // creates user array to be inserted
        var course = {
            id:0,
            name:req.body.name,
            period:req.body.period || 8,
            city:req.body.city,
            teacher:req.body.teacher,
            status:1,
        };

      (async () => { 
        // check if any teacher id has been entered
        if(course.teacher == undefined || course.teacher.length == 0){
          delete course.teacher;
        }else{
          // 
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
        
        // send to model
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
    let query = {'id': parseInt(req.params.id),'status': 1};

    if(req.body.name && req.body.period && req.body.city){
        var course = {};
        course.teacher = req.body.teacher
        let set = {id:parseInt(req.params.id), name: req.body.name, period: req.body.period || 8, city: req.body.city, teacher: course.teacher, status:1};
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
              courseModel.put(query, set)
              .then(result => {
              studentModel.updateCourse(parseInt(req.params.id), set);
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
        res.status(401).send('Não foi possível editar o curso');
    }
}

exports.deleteCourse = (req, res) => {
    let query = {'id': parseInt(req.params.id),'status':1};
    let set = {status:0};

    courseModel.delete(query, set)
    .then(result => {
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
}