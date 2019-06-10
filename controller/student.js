const studentModel = require('../model/student');
const courseModel = require('../model/course');
const Joi = require('joi');

const schemaStudent = Joi.object().keys({
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	age: Joi.number().required(),
	course: Joi.array().required(),
});

exports.getAllStudents = (req, res) => {
	//  define query and projection for search
	let query = {status:1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

	// send to model
	return studentModel.getAll(res, query, projection)
};

exports.getFilteredStudent = (req,res) => {
	//  define query and projection for search
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, age:1, "course.id":1, "course.name":1, "course.period":1, "course.city":1, "course.teacher.id":1, "course.teacher.name":1, "course.teacher.lastName":1, "course.teacher.phd":1}};

	// send to model
	return studentModel.getFiltered(res, query, projection)
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
		Joi.validate(req.body, schemaStudent, (err, result) =>{
			if(!err){
				// send to model
				return studentModel.post(req, res)
			}else{
				res.status(422).json({
					message: 'Não foi possível inserir o curso', 
					error: err.details[0].message
				});
			}
		});
	})();
};

exports.putStudent = (req, res) => {
	//  define query for search    
	let query = {'id': parseInt(req.params.id), 'status': 1};

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
		
		Joi.validate(req.body, schemaStudent, (err, result) =>{
			if(!err){
				// send to model
				return studentModel.put(req, res, query)
			}else{
				res.status(422).json({
					message: 'Não foi possível inserir o curso', 
					error: err.details[0].message
				});
			}
		});
	})();	  
};

exports.deleteStudent = (req, res) => {
	//  define query and set for search and delete    
	let query = {'id': parseInt(req.params.id), 'status':1};
	let set = {$set: {status:0}};

	// send to model
	studentModel.delete(res, query, set)
};

// exports.clean = (req, res) => {
// 	return studentModel.clean(res);
// }