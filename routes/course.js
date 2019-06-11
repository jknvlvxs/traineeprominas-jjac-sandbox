const express = require('express');
const router = express.Router();

const courseController = require('../controller/course'); // receive course controller

router.get('/course/', courseController.getAllCourses);
router.get('/course/:id', courseController.getFilteredCourse);

router.post('/course/', courseController.postCourse);
router.put('/course/:id', courseController.putCourse);

router.delete('/course/:id', courseController.deleteCourse);

router.get('/JSON/course/', courseController.jsonAllCourses); // json gets for API Rest
router.get('/JSON/course/:id', courseController.jsonFilteredCourse);

module.exports = router;