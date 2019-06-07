const teacherModel = require('../model/teacher');

exports.getAllTeachers = (req, res) => {
	//  define query and projection for search
	let query = {'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

	// send to model
	return teacherModel.getAll(req, res, query, projection)
};

exports.getFilteredTeacher = (req,res) => {
	//  define query and projection for search    
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, phd:1}};

	// send to model
	return teacherModel.getFiltered(res, query, projection)
};

exports.postTeacher = (req, res) => {
	// send to model
	return teacherModel.post(req, res) 
};

exports.putTeacher = (req, res) => {
	//  define query and set for search and update    
	let query = {'id': parseInt(req.params.id), 'status': 1};
	let set = {id:parseInt(req.params.id), name:req.body.name, lastName:req.body.lastName, phd:req.body.phd, status:1};

	// send to model
	return teacherModel.put(req, res, query, set)
};

exports.deleteTeacher = (req, res) => {
	//  define query and set for search and delete  
	let query = {'id': parseInt(req.params.id), 'status':1};
	let set = {status:0};

	// send to model
	return teacherModel.delete(req, res, query, set)
};

exports.clean = (req, res) => {
	return teacherModel.clean(res);
}