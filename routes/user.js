const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.get('/user/', userController.getAllUsers);
router.post('/user/', userController.postUser);

router.get('/user/:id', userController.getFilteredUser);
router.put('/user/:id', userController.putUser);
router.delete('/user/:id', userController.deleteUser);

router.get('/JSON/user/', userController.jsonAllUsers);
router.get('/JSON/user/:id', userController.jsonFilteredUser);

// router.delete('/', userController.clean);

module.exports = router;