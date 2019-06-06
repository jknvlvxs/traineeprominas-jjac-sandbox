const express = require('express');
const router = express.Router();

const teacherController = require('../controller/teacher');

router.get('/', teacherController.getAllTeachers);
router.post('/', teacherController.postTeacher);

router.get('/:id', teacherController.getFilteredTeacher);
router.put('/:id', teacherController.putTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;