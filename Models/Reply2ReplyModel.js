class Reply2ReplyModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Reply2Reply (
            ReplyID INTEGER REFERENCES Replies (ReplyID)
            ON DELETE CASCADE,
            reply TEXT,
            date TEXT,
            user TEXT
        )`
        return await this.DAO.run(sql)
    }


    async addReply2Reply (ReplyID, reply, date, user) {
        const sql = `INSERT INTO Reply2Reply (ReplyID, reply, date, user) VALUES (?, ?, ?, ?)`;
        
        await this.DAO.run(sql, [ReplyID, reply, date, user]);
    }

    async getReply2Reply (ReplyID) {
        return await this.DAO.all('SELECT * FROM Reply2Reply WHERE ReplyID = ?', [ReplyID]);
    }

}

module.exports = Reply2ReplyModel;