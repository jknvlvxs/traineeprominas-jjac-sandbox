const express = require('express');
const router = express.Router();

const studentController = require('../controller/student'); // receive student controller

router.get('/student/', studentController.getAllStudents);
router.get('/student/:id', studentController.getFilteredStudent);

router.post('/student/', studentController.postStudent);
router.put('/student/:id', studentController.putStudent);

router.delete('/student/:id', studentController.deleteStudent);

router.get('/JSON/student/', studentController.jsonAllStudents); // json gets for API Rest
router.get('/JSON/student/:id', studentController.jsonFilteredStudent);

module.exports = router;