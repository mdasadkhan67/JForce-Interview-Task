const connection = require('../config/db');

class User {
    static async create(userData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (name, username, email, password, mobile) VALUES (?, ?, ?, ?, ?)';
            connection.execute(
                query,
                [userData.name, userData.username, userData.email, userData.password, userData.mobile],
                (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                }
            );
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            connection.execute(query, [email], (error, results) => {
                if (error) reject(error);
                else resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ?';
            connection.execute(query, [username], (error, results) => {
                if (error) reject(error);
                else resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            connection.execute(query, [id], (error, results) => {
                if (error) reject(error);
                else resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, name, username, email, mobile, createdAt FROM users';
            connection.execute(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }
}

module.exports = User;
