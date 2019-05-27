const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const baseAPI = "/api/v1";

app.use(bodyParser.json());

app.use(baseAPI+'/student', require('./student'));
app.use(baseAPI+'/user', require('./user'));
app.use(baseAPI+'/course', require('./course'));
app.use(baseAPI+'/teacher', require('./teacher'));

app.get(baseAPI+'/', function (req, res) {
  res.send('Endpoints: \n /user \n /student \n /course \n /teacher');
})

// app.listen(process.env.PORT);
app.listen(3000);