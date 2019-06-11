const express = require('express');
const router = express.Router();

const studentController = require('../controller/student');

router.get('/student/', studentController.getAllStudents);
router.post('/student/', studentController.postStudent);

router.get('/student/:id', studentController.getFilteredStudent);
router.put('/student/:id', studentController.putStudent);
router.delete('/student/:id', studentController.deleteStudent);

router.get('/JSON/student/', studentController.jsonAllStudents);
router.get('/JSON/student/:id', studentController.jsonFilteredStudent);

// router.delete('/', studentController.clean);

module.exports = router;