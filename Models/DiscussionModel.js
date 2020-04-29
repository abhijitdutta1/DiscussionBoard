class DiscussionModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Discussion (
            ClassID TEXT REFERENCES Class (classID)
            ON DELETE CASCADE,
            QID INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            description TEXT,
            endDate DATE,
            endTime TEXT
        )`
        return await this.DAO.run(sql)
    }


    async addDiscussion (classID, question, description, endDate, endTime) {
        const sql = `INSERT INTO Discussion (classID, question, description, endDate, endTime) VALUES (?, ?, ?, ?, ?)`;
     
        await this.DAO.run(sql, [classID, question, description, endDate, endTime]);
    }

    async SearchQuestion (ClassID) {
        return await this.DAO.all('SELECT question FROM Discussion WHERE ClassID = ?', [ClassID]);
    }

}

module.exports = DiscussionModel;