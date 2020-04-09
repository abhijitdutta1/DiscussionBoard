class DiscussionModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Discussion (
            ClassID TEXT 
            FOREIGN KEY (ClassID)
            REFERANCES Class (ClassID)
            ON DELETE CASCADE,
            QID INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            endDate DATE,
            endTime TEXT,
            
        )`
        return await this.DAO.run(sql)
    }


    async addDiscussion (question, endDate, endTime) {
        const sql = `INSERT INTO Discussion (question, endDate, endTime) VALUES (?, ?, ?)`;
     
        await this.DAO.run(sql, [question, endDate, endTime]);
    }

    async SearchQuestion (ClassID) {
        return await this.DAO.get('SELECT question FROM Discussion WHERE ClassID = ?', [ClassID]);
    }

}

module.exports = DiscussionModel;