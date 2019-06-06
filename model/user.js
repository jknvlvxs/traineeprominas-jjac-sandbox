const database = require('../database');
const collection = database.getCollection('user');

var id;

(async () => {
     id = await collection.countDocuments({});
})();

exports.getAll = (res, query, projection) => {
    return collection.find(query, projection).toArray()
        .then(users => {
        if(users.length > 0){ 
            res.status(200).send(users);        
        }else{
            res.status(404).send('Nenhum usuário cadastrado');
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection user: ", err);
        res.status(500);
    });
};

exports.getFiltered = (res, query, projection) => {
    return collection.find(query, projection).toArray()
    .then(user => {
        if(user.length > 0){
            res.status(200).send(user);        
        }else{
            res.status(404).send('O usuário não foi encontrado');
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection user: ", err);
        res.status(500);
    });
};

exports.post = (res, user) => {
    // check required attributes
    if(user.name && user.lastName && user.profile && user.profile == 'guess' || user.profile == 'admin'){
        user.id = ++id;
        return collection.insertOne(user)
        .then(result => {
            if(result != false){
                res.status(201).send('Usuário cadastrado com sucesso!');
            }else{
                res.status(401).send('Não foi possível cadastrar o usuário (profile inválido)');
            }
        })
        .catch(err => {
            console.error("Erro ao conectar a collection user: ", err);
            res.status(500);
        });
    }else{
        res.status(401).send('Não foi possível cadastrar o usuário (profile inválido)');
    }
};

exports.put = (res, query, user) => {
    // check required attributes
    if(user.name && user.lastName && user.profile && user.profile == 'guess' || user.profile == 'admin'){
        return collection.findOneAndUpdate(query, {$set: user})
        .then(result => {
            if(result != false){
                if(result.value){ // if user exists
                    res.status(200).send('Usuário editado com sucesso!');
                }else{
                    res.status(401).send('Não é possível editar usuário inexistente');
                }
            }else{
                res.status(401).send('Não é possível editar usuário (profile inválido)');                    
            }
        })
        
        .catch(err => {
            console.error("Erro ao conectar a collection user: ", err);
            res.status(500);
        });
    }else{
        
    }
};

exports.delete = (res, query) => {
    return collection.findOneAndUpdate(query, {$set: {status:0}})
    .then(result => {
        if(result.value){ // if user exists
            console.log('O usuário foi removido');
            res.status(200).send('O usuário foi removido com sucesso');
          }else{
            console.log('Nenhum usuário foi removido');
            res.status(204).send();
          }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection user: ", err);
        res.status(500);
    });
};