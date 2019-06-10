const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema({
	id: {type: Number, unique: true},
	name: {type: String},
	lastName: {type: String},
	profile: {type: String, enum:['guess','admin']},
	status: {type: Number}
});

teacherSchema = new Schema({
	id: {type: Number, unique: true},
	name: {type: String},
	lastName: {type: String},
	phd: {type: Boolean, validate: [val => {return val == true}, 'É obrigatório o professor possuir phd']},
	status: {type: Number}
});
	
courseSchema = new Schema({
	id: {type: Number, unique: true},
	name: {type: String},
	period: {type: Number},
	city: {type: String},
	teacher: {type:[teacherSchema], validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores']},
	status: {type: Number}
});
	
studentSchema = new Schema({
	id: {type: Number, unique: true},
	name: {type: String},
	lastName: {type: String},
	age: {type: Number, min:17},
	course: {type:[courseSchema], validate: [val => {return val.length == 1}, 'É necessário pelo menos 1 curso']},
	status: {type: Number}
});

module.exports = {userSchema, teacherSchema, courseSchema, studentSchema};