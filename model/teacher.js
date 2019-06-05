const mongoClient = require('mongodb').MongoClient;
const mdbURL = 'mongodb+srv://admin:admin@cluster0-dp1yr.mongodb.net/test?retryWrites=true';

var db;
var collection;
var id;

mongoClient.connect(mdbURL, {useNewUrlParser:true}, (err, database) => {
  if(err){
    console.error('Ocorreu um erro ao conectar ao mongoDB');
    send.status(500);
  }else{
    db = database.db('trainee-prominas');
    collection = db.collection('teacher');
    collectionCourse = db.collection('course');
    collectionStudent = db.collection('student');
    collection.find({}).toArray((err, teacher) =>{id = teacher.length});
  }
});

exports.getAll = (query, projection) => {
    return collection.find(query, projection).toArray();
};

exports.getFiltered = (query, projection) => {
    return collection.find(query, projection).toArray();
};

exports.post = (teacher) => {
    teacher.id = ++id;
    return collection.insertOne(teacher);
};

exports.put = (query, set) => {
    return collection.findOneAndUpdate(query, {$set: set}, {returnOriginal:false});
};

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, {$set: set});
};

exports.getTeacher = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
};