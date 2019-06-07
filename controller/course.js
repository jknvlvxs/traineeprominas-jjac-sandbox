const courseModel = require('../model/course');
const teacherModel = require('../model/teacher');

exports.getAllCourses = (req, res) => {
  //  define query and projection for search
  let query = {status:1};
  let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

  // send to model
  return courseModel.getAll(res, query, projection)
};

exports.getFilteredCourse = (req,res) => {
  //  define query and projection for search
  let query = {'id':parseInt(req.params.id), 'status':1};
  let projection = {projection: {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}}

  // send to model
  return courseModel.getFiltered(res, query, projection)
};

exports.postCourse = (req, res) => {


    // creates course array to be inserted
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
          if(teacher.length > 0){
            course.teacher[i] = teacher[0]; 
          }else{ // if teacher exists
            course.teacher.splice(i, 1);
          }
        }
      }
        
      // send to model
      return courseModel.post(res, course)
    })();
};

exports.putCourse = (req, res) => {
  // define query for search
  let query = {'id': parseInt(req.params.id),'status': 1};

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
        if(teacher.length > 0){
          course.teacher[i] = teacher[0]; 
        }else{ // if teacher exists
          course.teacher.splice(i, 1);
        }
      }
      // send to model
      return courseModel.put(res, query, set)
    })();
};

exports.deleteCourse = (req, res) => {
  // define query and set to search and delete
  let query = {'id': parseInt(req.params.id),'status':1};
  let set = {status:0};

  // send to model
  return courseModel.delete(res, query, set)
};