const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const baseAPI = "/api/v1";

app.use(bodyParser.json());

const database = require('./database');

database
  .connect()
  .then(() => {

  
app.use(baseAPI+'/student', require('./routes/student'));
app.use(baseAPI+'/user', require('./routes/user'));
app.use(baseAPI+'/course', require('./routes/course'));
app.use(baseAPI+'/teacher', require('./routes/teacher'));

app.get(baseAPI+'/', function (req, res){
  res.send('Endpoints: \n '+baseAPI+'/user \n '+baseAPI+'/student \n '+baseAPI+'/course \n '+baseAPI+'/teacher');
});

app.get('/'+baseAPI, function (req, res){
  res.send('Endpoints: \n /user \n /student \n /course \n /teacher');
});

app.listen(process.env.PORT || 3000);

module.exports = app;

});