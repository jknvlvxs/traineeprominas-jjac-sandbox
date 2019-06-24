const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const baseAPI = "/api/v1";
const database = require('./database');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
//    });

database //connection to database.js
.connect()
	app.use(baseAPI, require('./routes/student')); //routes for student
	app.use(baseAPI, require('./routes/teacher')); //routes for teacher
	app.use(baseAPI, require('./routes/user')); //routes for user
	app.use(baseAPI, require('./routes/course')); //routes for course

	
	app.get(baseAPI+'/', function (req, res){ // index for project
	  	res.send('Endpoints: \n '+baseAPI+'/user \n '+baseAPI+'/student \n '+baseAPI+'/course \n '+baseAPI+'/teacher');
	});

	app.listen(process.env.PORT || 3000); // port of project heroku||localhost

module.exports = app;
