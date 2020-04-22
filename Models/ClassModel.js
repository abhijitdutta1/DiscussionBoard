class ClassModel {
    constructor (DAO) {
        this.DAO = DAO
    }

    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Class (
            classID TEXT PRIMARY KEY,
            name TEXT,
            instructor TEXT REFERENCES Users (email)
            ON DELETE CASCADE
        )`
        return await this.DAO.run(sql);
    }

    async addClass (classID, name, email) {
        const sql = `INSERT INTO Class (classID, name, instructor) VALUES (?, ?, ?)`;
        // classID needs to be unique so this will throw an exception if we 
        // attempt to add a class that already exists
        await this.DAO.run(sql, [classID, name, email]);
    }

    async searchClassByID (classID) {
        return await this.DAO.get('SELECT * FROM Class WHERE classID = ?', [classID]);
    }

    async searchClassByEmail (email) {
        return await this.DAO.get('SELECT * FROM Class WHERE email = ?', [email]);
    }
}

module.exports = ClassModel;