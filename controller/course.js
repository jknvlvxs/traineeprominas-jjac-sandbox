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
            res.status(200).send(courses);        
        }
    })
    .catch(err => {
        console.error('Erro ao conectar a collection course:', err);
        res.status(500);
    });
};

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
            res.status(200).send(course);        
        }
    })
    .catch(err => {
        console.error('Erro ao conectar a collection course:', err);
        res.status(500);
    });
};

exports.postCourse = (req, res) => {

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
          // receive the teacher related to the inserted id
          for(let i = course.teacher.length-1; i > -1 ; i--){
            teacher = await teacherModel.getTeacher(course.teacher[i]);
            if(teacher == null){
              course.teacher.splice(i, 1);
            }else{ // if teacher exists
              course.teacher[i] = teacher[0]; 
            }
          }
        }
        
        // send to model
        courseModel.post(course)
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
    })();
    }else{
        res.status(401).send('Não foi possível cadastrar o curso');
    }
};

exports.putCourse = (req, res) => {
    // define query for search
    let query = {'id': parseInt(req.params.id),'status': 1};

    // check required attributes
    if(req.body.name && req.body.period && req.body.city){

        // creates course array to update
      var course = {
        teacher:req.body.teacher
      };

        //  define set for update 
      let set = {id:parseInt(req.params.id), name: req.body.name, period: req.body.period || 8, city: req.body.city, teacher: course.teacher, status:1};
      (async () => {
        // receive the teacher related to the inserted id  
        for(let i = course.teacher.length-1; i > -1 ; i--){
          teacher = await teacherModel.getTeacher(course.teacher[i]);
          if(teacher == null){
            course.teacher.splice(i, 1);
          }else{ // if teacher exists
            course.teacher[i] = teacher[0]; 
          }
        }
              // send to model
              courseModel.put(query, set)
              .then(result => {
              // update course in student
                if(result != false){
                  res.status(200).send('Curso editado com sucesso!');
                  studentModel.updateCourse(parseInt(req.params.id), result.value);
                }else{
                  res.status(401).send('Não foi possível editar o curso (necessário pelo menos 2 professores)');
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
};

exports.deleteCourse = (req, res) => {
    // define query and set to search and delete
    let query = {'id': parseInt(req.params.id),'status':1};
    let set = {status:0};

    // send to model
    courseModel.delete(query, set)
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