const Task = require('../model/Task');
const logger = require('../helper/logger');
const { validateTaskCreation, validateTaskUpdate, formatValidationErrors } = require('../helper/validation');

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findByUserId(req.userId);
    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    logger.error('Get tasks error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUser(id, req.userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Get task error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { expenseName, amount, expenseDate, description } = req.body;

    const { error } = validateTaskCreation(req.body);
    if (error) {
      const errors = formatValidationErrors(error);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const result = await Task.create({
      userId: req.userId,
      expenseName,
      amount,
      expenseDate,
      description
    });

    const task = await Task.findById(result.insertId);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    logger.error('Create task error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseName, amount, expenseDate, description } = req.body;

    const { error } = validateTaskUpdate(req.body);
    if (error) {
      const errors = formatValidationErrors(error);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const task = await Task.findByIdAndUser(id, req.userId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.updateById(id, req.userId, {
      expenseName: expenseName ?? task.expenseName,
      amount: amount ?? task.amount,
      expenseDate: expenseDate ?? task.expenseDate,
      description: description ?? task.description
    });

    const updatedTask = await Task.findById(id);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    logger.error('Update task error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUser(id, req.userId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.deleteById(id, req.userId);
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete task error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

module.exports = {
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
