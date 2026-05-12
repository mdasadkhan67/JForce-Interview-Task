const express = require('express');
const taskController = require('../controller/taskController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, taskController.getMyTasks);
router.get('/:id', verifyToken, taskController.getTaskById);
router.post('/', verifyToken, taskController.createTask);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;
