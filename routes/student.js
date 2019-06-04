const express = require('express');
const router = express.Router();

const studentController = require('../controller/student');

router.get('/', studentController.getAllStudents);
router.post('/', studentController.postStudent);

router.get('/:id', studentController.getFilteredStudent);
router.put('/:id', studentController.putStudent);
router.delete('/:id', studentController.deleteStudent);


module.exports = router;