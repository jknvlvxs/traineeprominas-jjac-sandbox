const database = require('../database');
const collection = database.getCollection('course');
const studentModel = require('./student');

const mongoose = require('mongoose');
const courseSchema = require('./schema').courseSchema;
const Course = mongoose.model('Course', courseSchema);

var id;
(async () => {
		id = await collection.countDocuments({});
})();

exports.getAll = (res, query, projection) => {
	return collection.find(query, projection).toArray()
	.then(courses => {
		if(courses.length > 0){
			res.status(200).send(courses);        
		}else{
			res.status(404).send('Nenhum curso cadastrado');
		}
	})
	.catch(err => {
		console.error('Erro ao conectar a collection course:', err);
		res.status(500);
	});
};

exports.getFiltered = (res, query, projection) => {
	return collection.find(query, projection).toArray()
	.then(course => {
		if(course.length > 0){
			res.status(200).send(course);        
		}else{
			res.status(404).send('O curso não foi encontrado');
		}
	})
	.catch(err => {
		console.error('Erro ao conectar a collection course:', err);
		res.status(500);
	});
};

exports.post = (req, res) => {
	var course = new Course({id: ++id, name: req.body.name, period: req.body.period || 8, city: req.body.city, teacher: req.body.teacher, status: 1});
	course.validate(error => {
		if(!error){
			return collection.insertOne(course)
			.then(result => {
				res.status(201).send('Curso cadastrado com sucesso!');
			})
			.catch(err => {
				console.error('Erro ao conectar a collection course:', err);
				res.status(500);
			});
		}else{
			id--;
			res.status(401).json({
				message: 'Não foi possível cadastrar o curso', 
				error: error.errors.teacher.message
			});    
		}
	})
};

exports.put = (req, res, query) => {
	let course = ({id:parseInt(req.params.id), name: req.body.name, period: req.body.period || 8, city: req.body.city, teacher: req.body.teacher, status: 1});
	let validate = new Course(course);

	validate.validate(error =>{
		if(!error){
			return collection.findOneAndUpdate(query, {$set: course}, {returnOriginal:false} )
			.then(result => {
				// update course in student
				if(result.value){
					res.status(200).send('Curso editado com sucesso!');
					studentModel.updateCourse(parseInt(req.params.id), result.value);
				}else{
					res.status(401).send('Não é possível editar curso inexistente');
				}
			})
			.catch(err => {
					console.error('Erro ao conectar a collection course:', err);
					res.status(500);
			});
		}else{
			res.status(401).json({
				message: 'Não foi possível editar o curso', 
				error: error.errors.teacher.message
			});   
		}
	})	
};

exports.delete = (req, res, query) => {
	return collection.findOneAndUpdate(query, {$set: {status:0}})
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

exports.getCourse = (id) => {
	return collection.find({'id':id, 'status':1}).toArray();
};

exports.updateTeacher = (id, set) => {
	return collection.updateMany({'teacher.id':id, 'status':1}, {$set: {'teacher.$':set}});
};

exports.deleteTeacher = (id) => {
	return collection.findOneAndUpdate({'status':1, 'teacher.id':id}, {$pull: {"teacher": {'id': id}}});
};

exports.getCoursebyTeacher = () => {
	return collection.find({"status":1}).toArray();
};

exports.jsonAll = (res, query, projection) => {
	return collection.find(query, projection).toArray()
	.then(courses => {
		if(courses.length > 0){ 
			res.json(courses);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection course: ", err);
		res.status(500);
	});
};

exports.jsonFiltered = (res, query, projection) => {
	return collection.find(query, projection).toArray()
	.then(course => {
		if(course.length > 0){
			res.json(course);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection course: ", err);
		res.status(500);
	});
};