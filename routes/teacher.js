const express = require('express');
const router = express.Router();

const teacherController = require('../controller/teacher'); // receive teacher controller

router.get('/teacher/', teacherController.getAllTeachers);
router.get('/teacher/:id', teacherController.getFilteredTeacher);

router.post('/teacher/', teacherController.postTeacher);
router.put('/teacher/:id', teacherController.putTeacher);

router.delete('/teacher/:id', teacherController.deleteTeacher);

router.get('/JSON/teacher/', teacherController.jsonAllTeachers); // json gets for API Rest
router.get('/JSON/teacher/:id', teacherController.jsonFilteredTeacher);

module.exports = router;