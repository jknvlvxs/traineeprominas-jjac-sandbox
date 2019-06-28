const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const database = require('./database');
// require("dotenv-safe").load();

const baseAPI = "/api/v1";
const auth_baseAPI = "/api/v1.1";

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

database //connection to database.js
.connect()

var jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://jknvlvxs.auth0.com/.well-known/jwks.json'
	}),
	audience: 'https://traineeprominas-jjac-sandbox.herokuapp.com/api/v1.1/',
	issuer: 'https://jknvlvxs.auth0.com/',
	algorithms: ['RS256']
});

app.use(baseAPI, require('./routes/student')); //routes for student
app.use(baseAPI, require('./routes/teacher')); //routes for teacher
app.use(baseAPI, require('./routes/user')); //routes for user
app.use(baseAPI, require('./routes/course')); //routes for course
app.use(auth_baseAPI, jwtCheck, require('./routes/student')); //routes for student
app.use(auth_baseAPI, jwtCheck, require('./routes/teacher')); //routes for teacher
app.use(auth_baseAPI, jwtCheck, require('./routes/user')); //routes for user
app.use(auth_baseAPI, jwtCheck, require('./routes/course')); //routes for course

app.get('api/v1/', function (req, res){ // index for project
	res.send('Endpoints: \n /api/v1/user \n /api/v1/student \n /api/v1/course \n /api/v1/teacher');
});

app.get('/authorized', function (req, res){
	res.send('Secured Resource');
});

app.use(function (err, req, res, next){
	if(err.name === 'UnauthorizedError'){
		res.status(401).send('Invalid Token...');
	}
});

app.listen(process.env.PORT || 3000); // port of project heroku||localhost

module.exports = {app};
