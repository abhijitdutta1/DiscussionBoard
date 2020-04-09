class ClassModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Class (
            ClassID TEXT PRIMARY KEY,
            name TEXT,
            owner TEXT
            FOREIGN KEY (email)
            REFERANCES Users (email)
            ON DELETE CASCADE
        )`
        return await this.DAO.run(sql)
    }


    async addClass (ClassID, name) {
        const sql = `INSERT INTO Class (ClassID, name) VALUES (?, ?)`;
        // ClassID needs to be unique so this will throw an exception if we 
        // attempt to add a class that already exists
        await this.DAO.run(sql, [ClassID, name]);
    }

    async SearchClass (name) {
        return await this.DAO.get('SELECT * FROM Class WHERE name = ?', [name]);
    }
}

module.exports = ClassModel;