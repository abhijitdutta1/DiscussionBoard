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
            Reply TEXT
        )`
        return await this.DAO.run(sql)
    }


    async addReply (Reply) {
        const sql = `INSERT INTO Replies (Reply) VALUES (?)`;
        
        await this.DAO.run(sql, [Reply]);
    }

    async getReply (QID) {
        return await this.DAO.get('SELECT Reply FROM Replies WHERE QID = ?', [QID]);
    }

}

module.exports = RepliesModel;