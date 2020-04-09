class Reply2ReplyModel {
    constructor (DAO) {
        this.DAO = DAO
    }
  
    async createTable () {
        const sql = `
            CREATE TABLE IF NOT EXISTS Reply2Reply (
            ReplyID INTEGER 
            FOREIGN KEY (ReplyID)
            REFERANCES Replies (ReplyID)
            ON DELETE CASCADE,
            Reply TEXT
        )`
        return await this.DAO.run(sql)
    }


    async addReply2Reply (Reply) {
        const sql = `INSERT INTO Reply2Reply (Reply) VALUES (?)`;
        
        await this.DAO.run(sql, [Reply]);
    }

    async getReply2Reply (ReplyID) {
        return await this.DAO.get('SELECT Reply FROM Reply2Reply WHERE ReplyID = ?', [ReplyID]);
    }

}

module.exports = Reply2ReplyModel;