class RepliesModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Replies (
            QID INTEGER 
            FOREIGN KEY (QID)
            REFERANCES Discussion (QID)
            ON DELETE CASCADE,
            ReplyID INTEGER PRIMARY KEY AUTOINCREMENT,
            Reply TEXT,
            date DATE,
            time TEXT,
            user TEXT REFERENCES Users (email)
        )`
        return await this.DAO.run(sql)
    }


    async addReply (qid, reply, date, time, user) {
        const sql = `INSERT INTO Replies (QID, Reply, date, time, user) VALUES (?, ?, ?, ?, ?)`;
        
        await this.DAO.run(sql, [qid, reply, date, time, user]);
    }

    async getReply (QID) {
        return await this.DAO.get('SELECT Reply FROM Replies WHERE QID = ?', [QID]);
    }

}

module.exports = RepliesModel;