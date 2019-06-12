const mongoose = require('mongoose');
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/trainee-prominas?retryWrites=true';
mongoose.connect(mdbURL, { useNewUrlParser: true });

const studentSchema = require('./schema').studentSchema;
const Student = mongoose.model('Student', studentSchema, 'student');

var id;
Student.countDocuments({}, (err, count) => {
	id = count;
});

exports.getAll = (res, query, projection) => {
	return Student.find(query, projection)
	.then(students => {
		if(students.length > 0){
			res.status(200).send(students);        
		}else{
			res.status(404).send('Nenhum estudante cadastrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection student: ", err);
		res.status(500);
	});
};

exports.getFiltered = (res, query, projection) => {
	return Student.find(query, projection)
	.then(student => {
		if(student.length > 0){
			res.status(200).send(student);
		}else{
			res.status(404).send('O estudante não foi encontrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection student: ", err);
		res.status(500);
	});
};

exports.post = (req, res) => {
	var student = new Student({id: ++id, name: req.body.name, lastName: req.body.name, age: req.body.age, course:req.body.course, status:1});
	student.validate(error =>{
		if(!error){
			return Student.create(student)
			.then(result => {
					res.status(201).send('Estudante cadastrado com sucesso!');
			})
			.catch(err => {
				console.error("Erro ao conectar a collection student: ", err);
				res.status(500);
			});
		}else{
			id--;
			try{
				res.status(401).json({
					message: 'Não foi possível cadastrar o estudante', 
					error:[error.errors.course.message,
					error.errors.age.message]
				});
			}catch(TypeError){
				try{
					res.status(401).json({
						message: 'Não foi possível cadastrar o estudante', 
						error:error.errors.course.message
					});
				}catch(TypeError){
					res.status(401).json({
						message: 'Não foi possível cadastrar o estudante', 
						error:error.errors.age.message
					});
				}
			}
		}
	})
};

exports.put = (req, res, query) => {
	var student = ({id:parseInt(req.params.id), name: req.body.name, lastName: req.body.name, age: req.body.age, course:req.body.course, status:1});
	var validate = new Student(student)
	validate.validate(error => {
		if(!error){
			return Student.findOneAndUpdate(query, {$set:student})
			.then(result => {
					if(result){
						res.status(200).send('Estudante editado com sucesso!'); 
					}else{
						res.status(401).send('Não é possível editar estudante inexistente');
					}
			})
			.catch(err => {
					console.error("Erro ao conectar a collection student: ", err);
					res.status(500);
			});
		}else{
			try{
				res.status(401).json({
					message: 'Não foi possível cadastrar o estudante', 
					error:[error.errors.course.message,
					error.errors.age.message]
				});
			}catch(TypeError){
				try{
					res.status(401).json({
						message: 'Não foi possível cadastrar o estudante', 
						error:error.errors.course.message
					});
				}catch(TypeError){
					res.status(401).json({
						message: 'Não foi possível cadastrar o estudante', 
						error:error.errors.age.message
					});
				}
			}
		}
	})	
};

exports.delete = (res, query) => {
	return Student.findOneAndUpdate(query, {$set: {status:0}})
	.then(result => {
		if(result){ // if student exists
			console.log('O estudante foi removido');
			res.status(200).send('O estudante foi removido com sucesso');
		}else{
			console.log('Nenhum estudante foi removido');
			res.status(204).send();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection student: ", err);
		res.status(500);
	});
};

exports.updateCourse = (id, set) => {
	return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {"course.$": set}});
};

exports.deleteCourse = (id, set) => {
	return Student.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {status:0}});
};

exports.updateTeacher = (course) => {
	return Student.findOneAndUpdate({'status':1, 'course.id':course.id}, {$set: {'course.$':course}});
};

exports.jsonAll = (res, query, projection) => {
	return Student.find(query, projection)
	.then(students => {
		if(students.length > 0){ 
			res.json(students);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection student: ", err);
		res.status(500);
	});
};

exports.jsonFiltered = (res, query, projection) => {
	return Student.find(query, projection)
	.then(student => {
		if(student.length > 0){
			res.json(student);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection student: ", err);
		res.status(500);
	});
};