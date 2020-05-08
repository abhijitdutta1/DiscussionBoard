class RepliesModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Replies (
            QID INTEGER REFERENCES Discussion (QID)
            ON DELETE CASCADE,
            ReplyID INTEGER PRIMARY KEY AUTOINCREMENT,
            Reply TEXT,
            date TEXT,
            user TEXT
        )`
        return await this.DAO.run(sql)
    }

    async addReply (qid, reply, date, user) {
        const sql = `INSERT INTO Replies (QID, Reply, date, user) VALUES (?, ?, ?, ?)`;
        
        await this.DAO.run(sql, [qid, reply, date, user]);
    }

    async getReply (QID) {
        return await this.DAO.all('SELECT * FROM Replies WHERE QID = ?', [QID]);
    }

    async searchReply (ReplyID) {
        return await this.DAO.all('SELECT * FROM Replies WHERE ReplyID = ?', [ReplyID]);
    }

}

module.exports = RepliesModel;