const database = require('../database');

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

  }
};

exports.put = (query, set) => {
  if(set.phd == true){
    return collection.findOneAndUpdate(query, {$set: set}, {returnOriginal:false});
  }else{
    
  }
};

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, {$set: set});
};

exports.getTeacher = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
};