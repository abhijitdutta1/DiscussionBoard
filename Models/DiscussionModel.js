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
            due TEXT
        )`
        return await this.DAO.run(sql)
    }

    async addDiscussion (classID, question, description, datetimepicker1) {
        const sql = `INSERT INTO Discussion (classID, question, description, due) VALUES (?, ?, ?, ?)`;
     
        await this.DAO.run(sql, [classID, question, description, datetimepicker1]);
    }

    async SearchQuestion (ClassID) {
        return await this.DAO.all('SELECT * FROM Discussion WHERE ClassID = ?', [ClassID]);
    }

    async SearchDiscussion (qid) {
        return await this.DAO.get('SELECT * FROM Discussion WHERE QID = ?', [qid]);
    }
}

module.exports = DiscussionModel;