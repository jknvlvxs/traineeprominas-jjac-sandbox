const userModel = require('../model/user');

exports.getAllUsers = (req, res) => {
    let query = {status:1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

    userModel.getAll(query, projection)
    .then(users => {
        if(users.length == 0){
            res.status(404).send('Nenhum usuário cadastrado');
        }else{
            res.send(users);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection user: ", err);
        res.status(500);
    });
}

exports.getFilteredUser = (req,res) => {
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

    userModel.getFiltered(query, projection)
    .then(users => {
        if(users.length == 0){
            res.status(404).send('O usuário não foi encontrado');
        }else{
            res.send(users);        
        }
    })
    .catch(err => {
        console.error("Erro ao conectar a collection user: ", err);
        res.status(500);
    });
}

exports.postUser = (req, res) => {
    if(req.body.name && req.body.lastName && req.body.profile){
        let user = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
            profile:req.body.profile,
            status:1
        };

        userModel.post(user)
        .then(users => {
            res.status(201).send('Usuário cadastrado com sucesso!');
        })
        .catch(err => {
            console.error("Erro ao conectar a collection user: ", err);
            res.status(500);
        });
    }else{
        res.status(401).send('Não foi possível cadastrar o usuário');
    }
}

exports.putUser = (req, res) => {
    if(req.body.name && req.body.lastName && req.body.profile){
        let query = {'id': parseInt(req.params.id), 'status': 1};
        let set = {$set:{name: req.body.name, lastName: req.body.lastName, profile: req.body.profile}};
        
        userModel.put(query, set)
        .then(result => {
            if(result.value){
                res.status(201).send('Usuário editado com sucesso!');
            }else{
                res.status(401).send('Não é possível editar usuário inexistente');
            }
        })
        .catch(err => {
            console.error("Erro ao conectar a collection user: ", err);
            res.status(500);
        });
    }else{
        res.status(401).send('Não foi possível editar o usuário');
    }
}