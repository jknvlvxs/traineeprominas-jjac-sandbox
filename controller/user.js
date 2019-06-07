const userModel = require('../model/user');

exports.getAllUsers = (req, res) => {
	//  define query and projection for search
	let query = {status:1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

	// send to model
	return userModel.getAll(res, query, projection);
};

exports.getFilteredUser = (req,res) => {
	//  define query and projection for search
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

	// send to model
	return userModel.getFiltered(res, query, projection)
};

exports.postUser = (req, res) => {
	// send to model
	return userModel.post(req, res)
};

exports.putUser = (req, res) => {
	//  define query and set for search and update    
	let query = {'id': parseInt(req.params.id), 'status': 1};
	let set = {name: req.body.name, lastName: req.body.lastName, profile: req.body.profile};
		
	// send to model
	return userModel.put(req, res, query, set)
};

exports.deleteUser = (req, res) => {
	//  define query and set for search and delete    
	let query = {'id': parseInt(req.params.id), 'status':1};

	// send to model
	return userModel.delete(req, res, query)
};

exports.clean = (req, res) => {
	return userModel.clean(res);
}