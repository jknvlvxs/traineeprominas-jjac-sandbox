const database = require('../database');
const collection = database.getCollection('teacher');

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

exports.post = (teacher) => {
  if (teacher.phd == true){
    teacher.id = ++id;
    return collection.insertOne(teacher);  
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
};

exports.put = (query, set) => {
  if(set.phd == true){
    return collection.findOneAndUpdate(query, {$set: set}, {returnOriginal:false});
  }else{
    return new Promise((resolve, reject) => {
      resolve(false);
  });
  }
};

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, {$set: set});
};

exports.getTeacher = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
};