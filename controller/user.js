module.exports.getAll = function(app, req, res){
    var userModel = new app.src.model.user();

    userModel.getAllUsers(function (err, result) {
        console.log('entrou control');

        if(!err){
            if(result.length == 0){
                res.status(404).send('Usuário não encontrado');
            }else{
                res.send(user);
            }
        }else{
            console.error('Ocorreu um erro ao conectar a collection user');
            send.status(500);
        }
    })
};