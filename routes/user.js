const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.get('/', userController.getAllUsers);
router.post('/', userController.postUser);

router.get('/:id', userController.getFilteredUser);
router.put('/:id', userController.putUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;