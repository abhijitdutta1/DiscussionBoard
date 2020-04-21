const UserModel = require('../Models/UserModel');

exports.getUserID = async function (email) {
    return await UserModel.getUserID(email);
}