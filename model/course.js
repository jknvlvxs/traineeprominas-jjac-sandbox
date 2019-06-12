const mongoose = require('mongoose');
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/trainee-prominas?retryWrites=true';
mongoose.connect(mdbURL, { useNewUrlParser: true });

const courseSchema = require('./schema').courseSchema;
const Course = mongoose.model('Course', courseSchema, 'course');

const studentModel = require('./student');

var id;
Course.countDocuments({}, (err, count) => {
	id = count;
});

exports.getAll = (res, query, projection) => {
	return Course.find(query, projection)
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
	return Course.find(query, projection)
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
			return Course.create(course)
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
			return Course.findOneAndUpdate(query, {$set: course}, {returnOriginal:false} )
			.then(result => {
				// update course in student
				if(result){
					res.status(200).send('Curso editado com sucesso!');
					studentModel.updateCourse(parseInt(req.params.id), result);
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
	return Course.findOneAndUpdate(query, {$set: {status:0}})
	.then(result => {
		// delete course in student
		studentModel.deleteCourse(parseInt(req.params.id));
		if(result){
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
	return Course.find({'id':id, 'status':1});
};

exports.updateTeacher = (id, set) => {
	return Course.updateMany({'teacher.id':id, 'status':1}, {$set: {'teacher.$':set}});
};

exports.deleteTeacher = (id) => {
	return Course.findOneAndUpdate({'status':1, 'teacher.id':id}, {$pull: {"teacher": {'id': id}}});
};

exports.getCoursebyTeacher = () => {
	return Course.find({"status":1});
};

exports.jsonAll = (res, query, projection) => {
	return Course.find(query, projection)
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
	return Course.find(query, projection)
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