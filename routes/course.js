const express = require('express');
const router = express.Router();

const courseController = require('../controller/course');

router.get('/course/', courseController.getAllCourses);
router.post('/course/', courseController.postCourse);

router.get('/course/:id', courseController.getFilteredCourse);
router.put('/course/:id', courseController.putCourse);
router.delete('/course/:id', courseController.deleteCourse);

router.get('/JSON/course/', courseController.jsonAllCourses);
router.get('/JSON/course/:id', courseController.jsonFilteredCourse);

// router.delete('/', courseController.clean);

module.exports = router;