class UserModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Users (
            email TEXT PRIMARY KEY,
            name TEXT,
            passwordHash TEXT,
            isInstructor VARCHAR(1) DEFAULT '0'
        )`
        return await this.DAO.run(sql)
    }


    async addUser (email, name, passwordHash, isInstructor) {
        const sql = `INSERT INTO Users (email, name, passwordHash, isInstructor) VALUES (?, ?, ?, ?)`;
        // Username needs to be unique so this will throw an exception if we 
        // attempt to add a user that already exists
        await this.DAO.run(sql, [email, name, passwordHash, isInstructor]);
    }

    async getPasswordHash (email) {
        return await this.DAO.get('SELECT passwordHash FROM Users WHERE email = ?', [email]);
    }
}

module.exports = UserModel;