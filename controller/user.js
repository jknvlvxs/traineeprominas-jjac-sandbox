const userModel = require('../model/user');

exports.getAllUsers = (req, res) => {
    //  define query and projection for search
    let query = {status:1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

    // send to model
    userModel.getAll(query, projection)
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

exports.getFilteredUser = (req,res) => {
    //  define query and projection for search
    let query = {'id':parseInt(req.params.id), 'status':1};
    let projection = {projection: {_id:0, id: 1, name: 1, lastName: 1, profile:1}};

    // send to model
    userModel.getFiltered(query, projection)
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

exports.postUser = (req, res) => {

    // check required attributes
    if(req.body.name && req.body.lastName && req.body.profile){
        
        // creates user array to be inserted
        let user = {
            id:0,
            name:req.body.name,
            lastName:req.body.lastName,
            profile:req.body.profile,
            status:1
        };

            // send to model
            userModel.post(user)
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

exports.putUser = (req, res) => {
    // check required attributes
    if(req.body.name && req.body.lastName && req.body.profile){

        //  define query and set for search and update    
        let query = {'id': parseInt(req.params.id), 'status': 1};
        let set = {name: req.body.name, lastName: req.body.lastName, profile: req.body.profile};
        
            // send to model
            userModel.put(query, set)
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
        res.status(401).send('Não foi possível editar o usuário');
    }
};

exports.deleteUser = (req, res) => {
    //  define query and set for search and delete    
    let query = {'id': parseInt(req.params.id), 'status':1};

    // send to model
    userModel.delete(query)
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