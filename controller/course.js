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
    (async () => { 
        // check if any teacher id has been entered
        if(req.body.teacher == undefined || req.body.teacher.length == 0){
            delete req.body.teacher;
        }else{
            // receive the teacher related to the inserted id
            for(let i = req.body.teacher.length-1; i > -1 ; i--){
                teacher = await teacherModel.getTeacher(req.body.teacher[i]);
                if(teacher.length > 0){
                    req.body.teacher[i] = teacher[0]; 
                }else{ // if teacher exists
                    req.body.teacher.splice(i, 1);
                }
            }
        }      
        // send to model
        return courseModel.post(req, res)
    })();
};

exports.putCourse = (req, res) => {
    // define query for search
    let query = {'id': parseInt(req.params.id),'status': 1};

    (async () => {
        // receive the teacher related to the inserted id  
        for(let i = req.body.teacher.length-1; i > -1 ; i--){
            teacher = await teacherModel.getTeacher(req.body.teacher[i]);
            if(teacher.length > 0){
                req.body.teacher[i] = teacher[0]; 
            }else{ // if teacher exists
                req.body.teacher.splice(i, 1);
            }
        }
      // send to model
      return courseModel.put(req, res, query)
    })();
};

exports.deleteCourse = (req, res) => {
    // define query and set to search and delete
    let query = {'id': parseInt(req.params.id),'status':1};
    let set = {status:0};

    // send to model
    return courseModel.delete(req, res, query, set)
};

exports.clean = (req, res) => {
    return courseModel.clean(res);
}