const database = require('../database');
const collection = database.getCollection('user');

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

exports.post = (user) => {
    if(user.profile == 'guess' || user.profile == 'admin'){
        user.id = ++id;
        return collection.insertOne(user);
    }else{
        // return false;
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
};

exports.put = (query, set) => {
    if(set.profile == 'guess' || set.profile == 'admin'){
        return collection.findOneAndUpdate(query, {$set: set});
    }else{
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
};

exports.delete = (query) => {
    return collection.findOneAndUpdate(query, {$set: {status:0}});
};