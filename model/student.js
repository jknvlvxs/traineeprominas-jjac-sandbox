const database = require('../database');
const collection = database.getCollection('student');

var id;

(async () => {
  id = await collection.countDocuments({});
})();

exports.getAll = (query, projection) => {
    return collection.find(query, projection).toArray();
};

exports.getFiltered = (query, projection) => {
    return collection.find(query, projection).toArray();
};

exports.post = (student) => {
  if (student.age >= 17 && student.course.length == 1){
    student.id = ++id;    
    return collection.insertOne(student);
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
};

exports.put = (query, set) => {
  if (set.age >= 17 && set.course.length == 1){
    return collection.findOneAndUpdate(query, {$set:set});
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
};

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, set);
};

exports.updateCourse = (id, set) => {
  return collection.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {"course.$": set}});
};

exports.deleteCourse = (id, set) => {
  return collection.findOneAndUpdate({'course.id':id, 'status':1}, {$set: {status:0}});
};

exports.updateTeacher = (course) => {
  return collection.findOneAndUpdate({'status':1, 'course.id':course.id}, {$set: {'course.$':course}});
};