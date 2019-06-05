const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';
var db;
var collection;
var collectionTeacher;
var collectionStudent;

var id;

mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500);
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('course');
    collectionTeacher = db.collection('teacher');
    collectionStudent = db.collection('student');
    collection.find({}).toArray((err, course) =>{id = course.length});
    
  }
});

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
  return collection.findOneAndUpdate(query, {$set: set});
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