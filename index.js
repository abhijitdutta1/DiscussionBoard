const express         = require('express');
const app             = express();
const path            = require('path');
const createDAO       = require('./Models/dao');
const UserModel       = require('./Models/UserModel');
const ClassModel      = require('./Models/ClassModel');
const DiscussionModel = require('./Models/DiscussionModel');
const RepliesModel    = require('./Models/RepliesModel');
const Reply2replyModel= require('./Models/Reply2ReplyModel');
const AuthController  = require('./Controllers/AuthController');

const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Discussion.db');
let Auth   = undefined;

// gives direct access to GET files from the "public" directory 
app.use(express.static('public'));

// need this line so express can parse the POST data the browser
// automatically sends
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 80;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup.html'));
});

app.get('/icourse', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/iCourse.html'));
});
app.get('/idiscussion', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/iDiscussion.html'));
});
app.get('/sCourse', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/sCourse.html'));
});
app.get('/sDiscussion', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/sDiscussion.html'));
});

// Listen on port 80 (Default HTTP port)
app.listen(80, async () => {
    // wait until the db is initialized and all models are initialized
    await initDB();
    // Then log that the we're listening on port 80
    console.log("Listening on port 80.");
});

async function initDB () {
    const dao = await createDAO(dbFilePath);
    Users = new UserModel(dao);
    await Users.createTable();
    Auth = new AuthController(dao);
}