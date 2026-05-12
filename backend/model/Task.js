const connection = require('../config/db');

class Task {
  static async create(taskData) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO tasks (userId, expenseName, amount, expenseDate, description) VALUES (?, ?, ?, ?, ?)';
      connection.execute(
        query,
        [taskData.userId, taskData.expenseName, taskData.amount, taskData.expenseDate, taskData.description],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, expenseName, amount, expenseDate, description, createdAt, updatedAt FROM tasks WHERE userId = ? ORDER BY expenseDate DESC';
      connection.execute(query, [userId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }

  static async findById(taskId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ?';
      connection.execute(query, [taskId], (error, results) => {
        if (error) reject(error);
        else resolve(results.length > 0 ? results[0] : null);
      });
    });
  }

  static async findByIdAndUser(taskId, userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ? AND userId = ?';
      connection.execute(query, [taskId, userId], (error, results) => {
        if (error) reject(error);
        else resolve(results.length > 0 ? results[0] : null);
      });
    });
  }

  static async updateById(taskId, userId, taskData) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tasks SET expenseName = ?, amount = ?, expenseDate = ?, description = ? WHERE id = ? AND userId = ?';
      connection.execute(
        query,
        [taskData.expenseName, taskData.amount, taskData.expenseDate, taskData.description, taskId, userId],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });
  }

  static async deleteById(taskId, userId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ? AND userId = ?';
      connection.execute(query, [taskId, userId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }
}

module.exports = Task;
