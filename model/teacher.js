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
    return collection.findOneAndUpdate(query, set, {returnOriginal: false}, (err, info) => {
        (async () => {
 
            var updateTeacher = info.value;
            
            try {
              await collectionCourse.updateMany(
                {"status":1, "teacher.id":parseInt(req.params.id)},
                {$set: {"teacher.$": updateTeacher}});
      
              var courses = await collectionCourse.find({"status":1, "teacher.id":parseInt(req.params.id)}).toArray();
              
              for (var i = 0; i<courses.length; i++){
                await collectionStudent.findOneAndReplace(
                    {"status":1, "course.id":courses[i].id},
                    {$set: {"course":courses[i]}});
              }
      
              } catch(err){
                console.log(err);
              }
      
          })();
    });
}

exports.delete = (query, set) => {
  return collection.findOneAndUpdate(query, set);
}

exports.getTeacher = (id) => {
  return collection.find({'id':id, 'status':1}).toArray();
}