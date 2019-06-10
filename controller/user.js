const userModel = require('../model/user');
const Joi = require('joi');

const schemaUser = Joi.object().keys({
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	profile: Joi.string().required(),
});

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
	Joi.validate(req.body, schemaUser, (err, result) =>{
		if(!err){
			// send to model
			return userModel.post(req, res)
		}else{
			res.status(422).json({
				message: 'Não foi possível inserir o usuário', 
				error: err.details[0].message
			});
		}
	});
};

exports.putUser = (req, res) => {
	//  define query and set for search and update    
	let query = {'id': parseInt(req.params.id), 'status': 1};

	Joi.validate(req.body, schemaUser, (err, result) =>{
		if(!err){
			// send to model
			return userModel.put(req, res, query);
		}else{
			res.status(422).json({
				message: 'Não foi possível editar o usuário', 
				error: err.details[0].message
			});
		}
	});
};

exports.deleteUser = (req, res) => {
	//  define query and set for search and delete    
	let query = {'id': parseInt(req.params.id), 'status':1};

	// send to model
	return userModel.delete(res, query)
};

// exports.clean = (req, res) => {
// 	return userModel.clean(res);
// }