class Student2ClassModel {
    constructor (DAO) {
        this.DAO = DAO
    }

    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Student2Class (
            classID TEXT REFERENCES Class (classID)
            ON DELETE CASCADE,
            student TEXT REFERENCES Users (email)
            ON DELETE CASCADE,
            PRIMARY KEY (classID, student)
        )`
        return await this.DAO.run(sql);
    }

    async registerStudent (classID, email) {
        const sql = `INSERT INTO Student2Class (classID, student) VALUES (?, ?)`;
        await this.DAO.run(sql, [classID, email]);
    }

    async searchClassByStudent (email) {
        return await this.DAO.all('SELECT c.name FROM Student2Class sc, Class c WHERE student = ? AND sc.classID = c.classID', [email]);
    }
}

module.exports = Student2ClassModel;