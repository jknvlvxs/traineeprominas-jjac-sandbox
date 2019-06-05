const database = require('../database');
const courseCollection = database.getCollection('user');

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
        return false;
    }
};

exports.put = (query, set) => {
    if(set.profile == 'guess' || set.profile == 'admin'){
        return collection.findOneAndUpdate(query, {$set: set});
    }else{
        return false;
    }
};

exports.delete = (query) => {
    return collection.findOneAndUpdate(query, {$set: {status:0}});
};