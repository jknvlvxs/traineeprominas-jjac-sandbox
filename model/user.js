const mongoose = require('mongoose');
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/trainee-prominas?retryWrites=true';
mongoose.connect(mdbURL, { useNewUrlParser: true });

const userSchema = require('./schema').userSchema;
const User = mongoose.model('User', userSchema, 'user');

var id;
User.countDocuments({}, (err, count) => {
	id = count;
});

exports.getAll = (res, query, projection) => {
	return User.find(query, projection)
	.then(users => {
		if(users.length > 0){ 
			res.status(200).send(users);        
		}else{
			res.status(404).send('Nenhum usuário cadastrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection user: ", err);
		res.status(500);
	});
};

exports.getFiltered = (res, query, projection) => {
	return User.find(query, projection)
	.then(user => {
		if(user.length > 0){
			res.status(200).send(user);        
		}else{
			res.status(404).send('O usuário não foi encontrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection user: ", err);
		res.status(500);
	});
};

exports.post = (req, res) => {
	let user = new User({id: ++id, name: req.body.name, lastName: req.body.lastName, profile: req.body.profile, status: 1});
	user.validate(error => {
		if(!error){
			return User.create(user)
			.then(result => {
				res.status(201).send('Usuário cadastrado com sucesso!');
			})
			.catch(err => {
				console.error("Erro ao conectar a collection user: ", err);
				res.status(500);
			});
		}else{
			id--;
			res.status(401).json({
				message: 'Não foi possível cadastrar o usuário', 
				error: error.errors.profile.message
			});
		}
	});
};

exports.put = (req, res, query) => {
	let user = ({id:parseInt(req.params.id), name: req.body.name, lastName: req.body.lastName, profile: req.body.profile, status: 1});
	let validate = new User(user);
	
	validate.validate(error =>{
		if(!error){
			return User.findOneAndUpdate(query, {$set: user})
			.then(result => {
				if(result){
					res.status(200).send('Usuário editado com sucesso!');
				}else{
					res.status(401).send('Não é possível editar usuário inexistente');                    
				}
			})
			.catch(err => {
				console.error("Erro ao conectar a collection user: ", err);
				res.status(500);
			});
		}else{
			res.status(401).json({
				message: 'Não foi possível cadastrar o usuário', 
				error: error.errors.profile.message
			});                
		}
	})
};

exports.delete = (res, query) => {
	return User.findOneAndUpdate(query, {$set: {status:0}})
	.then(result => {
		if(result){ // if user exists
			console.log('O usuário foi removido');
			res.status(200).send('O usuário foi removido com sucesso');
		  }else{
			console.log('Nenhum usuário foi removido');
			res.status(204).send();
		  }
	})
	.catch(err => {
		console.error("Erro ao conectar a collection user: ", err);
		res.status(500);
	});
};

exports.jsonAll = (res, query, projection) => {
	return User.find(query, projection)
	.then(users => {
		if(users.length > 0){ 
			res.json(users);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection user: ", err);
		res.status(500);
	});
};

exports.jsonFiltered = (res, query, projection) => {
	return User.find(query, projection)
	.then(user => {
		if(user.length > 0){
			res.json(user);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection user: ", err);
		res.status(500);
	});
};