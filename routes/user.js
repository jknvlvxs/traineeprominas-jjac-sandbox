const express = require('express');
const router = express.Router();

const userController = require('../controller/user'); // receive user controller

router.get('/user/', userController.getAllUsers);
router.get('/user/:id', userController.getFilteredUser);

router.post('/user/', userController.postUser);
router.put('/user/:id', userController.putUser);

router.delete('/user/:id', userController.deleteUser);

router.get('/JSON/user/', userController.jsonAllUsers); // json gets for API Rest
router.get('/JSON/user/:id', userController.jsonFilteredUser);

module.exports = router;