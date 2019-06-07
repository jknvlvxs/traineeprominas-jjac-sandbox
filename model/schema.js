const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    profile: {type: String, required: true, enum:['guess','admin']},
    status: {type: Number, required: true}
});

teacherSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    phd: {type: Boolean, required: true, validate: [val => {return val == true}, 'É obrigatório o professor possuir phd']},
    status: {type: Number, required: true}
  });
  
courseSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    period: {type: Number, required: true},
    city: {type: String, required: true},
    teacher: {type:[teacherSchema], validate: [val => {return val.length >= 2}, 'São necessários pelo menos 2 professores']},
    status: {type: Number, required: true}
  });
  
studentSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    age: {type: Number, required: true, min:17},
    course: {type:[courseSchema], validate: [val => {return val.length >= 1}, 'É necessário pelo menos 1 curso']},
    status: {type: Number, required: true}
  });

module.exports = {userSchema, teacherSchema, courseSchema, studentSchema}