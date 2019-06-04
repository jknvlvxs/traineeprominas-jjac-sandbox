const express = require('express');
const router = express.Router();

const courseController = require('../controller/course');

router.get('/', courseController.getAllCourses);
router.post('/', courseController.postCourse);

router.get('/:id', courseController.getFilteredCourse);
router.put('/:id', courseController.putCourse);
router.delete('/:id', courseController.deleteCourse);


module.exports = router;