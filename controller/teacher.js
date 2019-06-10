const teacherModel = require('../model/teacher');
const Joi = require('joi');

const schemaTeacher = Joi.object().keys({
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	phd: Joi.boolean().required(),
});

exports.getAllTeachers = (req, res) => {
	//  define query and projection for search
	let query = {'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

	// send to model
	return teacherModel.getAll(res, query, projection)
};

exports.getFilteredTeacher = (req,res) => {
	//  define query and projection for search    
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

	// send to model
	return teacherModel.getFiltered(res, query, projection)
};

exports.postTeacher = (req, res) => {
	Joi.validate(req.body, schemaTeacher, (err, result) => {
		if(!err){
			// send to model
			return teacherModel.post(req, res);
		}else{
			res.status(422).json({
				message: 'Não foi possível inserir o professor', 
				error: err.details[0].message
			});
		}
	})
};

exports.putTeacher = (req, res) => {
	//  define query and set for search and update    
	let query = {'id': parseInt(req.params.id), 'status': 1};

	Joi.validate(req.body, schemaTeacher, (err, result) => {
		if(!err){
			// send to model
			return teacherModel.put(req, res, query)
		}else{
			res.status(422).json({
				message: 'Não foi possível inserir o professor', 
				error: err.details[0].message
			});
		}
	})
};

exports.deleteTeacher = (req, res) => {
	//  define query and set for search and delete  
	let query = {'id': parseInt(req.params.id), 'status':1};
	let set = {status:0};

	// send to model
	return teacherModel.delete(req, res, query, set)
};

// exports.clean = (req, res) => {
// 	return teacherModel.clean(res);
// }