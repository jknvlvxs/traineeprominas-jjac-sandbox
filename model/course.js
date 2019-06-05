const database = require('../database');
const courseCollection = database.getCollection('course');

exports.getAll = (query, projection) => {
  return collection.find(query, projection).toArray();
};

exports.getFiltered = (query, projection) => {
  return collection.find(query, projection).toArray();
};

exports.post = (course) => {
  course.id = ++id;
  return collection.insertOne(course);
};

exports.put = (query, set) => {
  return collection.findOneAndUpdate(query, {$set: set}, {returnOriginal:false} );
};

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, {$set: set});
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
  return collectionCourse.find({"status":1}).toArray();
};