const studentModel = require('../model/student');
const courseModel = require('../model/course');

exports.getAllStudents = (req, res) => {
	//  define query and projection for search
	let query = {status:1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

	// send to model
	return studentModel.getAll(req, res, query, projection)
};

exports.getFilteredStudent = (req,res) => {
	//  define query and projection for search
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

	// send to model
	return studentModel.getFiltered(req, res, query, projection)
};

exports.postStudent = (req, res) => {
	(async () => {
		// receive the course related to the inserted id
		for(let i = 0; i < req.body.course.length; i++){
			let course = await courseModel.getCourse(req.body.course[i]);
			if(course.length > 0){ // if course exists
				req.body.course[i] = course[0]; 
			}else{
				req.body.course.splice(i, 1);
			}
		} 		
		// send to model
		return studentModel.post(req, res)
	})();
};

exports.putStudent = (req, res) => {
	//  define query for search    
	let query = {'id': parseInt(req.params.id), 'status': 1};


	// creates student array to update
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
		// send to model
		return studentModel.put(req, res, query, set)
	})();	  
};

exports.deleteStudent = (req, res) => {
	//  define query and set for search and delete    
	let query = {'id': parseInt(req.params.id), 'status':1};
	let set = {$set: {status:0}};

	// send to model
	studentModel.delete(req, res, query, set)
};

exports.clean = (req, res) => {
	return studentModel.clean(res);
}