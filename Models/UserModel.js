const uuidV4 = require('uuid').v4;

class UserModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Users (
            uuid TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            name TEXT,
            passwordHash TEXT,
            isInstructor VARCHAR(1) DEFAULT '0'
        )`
        return await this.DAO.run(sql)
    }

    async getUserID (email) {
        const sql = `SELECT uuid from Users WHERE email=?`;
        return await this.DAO.get(sql, [email]);
    }

    async addUser (email, name, passwordHash, isInstructor) {
        const sql = `INSERT INTO Users VALUES (?, ?, ?, ?, ?)`;
        const uuid = uuidV4();
        await this.DAO.run(sql, [uuid, email, name, passwordHash, isInstructor]);
    }

    async getPasswordHash (email, isInstructor) {
        return await this.DAO.get('SELECT passwordHash FROM Users WHERE email = ? AND isInstructor = ?', [email, isInstructor]);
    }
}

module.exports = UserModel;