const express = require('express');
const router = express.Router();

const teacherController = require('../controller/teacher');

router.get('/teacher/', teacherController.getAllTeachers);
router.post('/teacher/', teacherController.postTeacher);

router.get('/teacher/:id', teacherController.getFilteredTeacher);
router.put('/teacher/:id', teacherController.putTeacher);
router.delete('/teacher/:id', teacherController.deleteTeacher);

router.get('/JSON/teacher/', teacherController.jsonAllTeachers);
router.get('/JSON/teacher/:id', teacherController.jsonFilteredTeacher);
// router.delete('/', teacherController.clean);

module.exports = router;