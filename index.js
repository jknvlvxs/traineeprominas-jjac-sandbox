const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());


var students = [
{"name": "Marcos", "age": "18"},
{"name": "Pedro", "age": "27"},
{"name": "Lucas", "age": "20"}]

app.get('/', function (req, res) {
  res.send('Hello World - GET');
})

app.post('/students', function (req, res) { //CREATE
  var student = req.body;
  students.push(student);
  res.send('Estudante cadastrado com sucesso!');
})

app.get('/students', function (req, res) { //READ ALL
  res.send(students);
})

app.get('/students/:name', function (req, res) { //READ FILTERED
  var name = req.params.name;
  var filteredStudent = students.filter((s) => {return s.name == name; });
  if (filteredStudent.length >= 1){
    res.send(filteredStudent[0]);
  } else{
    res.status(404).send('Estudante não encontrado');
  }
})

app.delete('/students', function (req, res) { //DELETE ALL
  students = [];
  res.send('Todos os estudantes foram removidos com sucesso!');
})

app.listen(process.env.PORT);