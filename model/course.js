const database = require('../database');
const collection = database.getCollection('course');

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

exports.post = (course) => {
  if(course.teacher.length >= 2){
    course.id = ++id;
    return collection.insertOne(course);  
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
};

exports.put = (query, set) => {
  if(set.teacher.length >= 2){
    return collection.findOneAndUpdate(query, {$set: set}, {returnOriginal:false} );
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
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
  return collection.find({"status":1}).toArray();
};