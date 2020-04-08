const express         = require('express');
const app             = express();
const path            = require('path');
const createDAO       = require('./Models/dao');
// const ClassModel      = require('./Models/ClassModel');
// const DiscussionModel = require('./Models/DiscussionModel');
const UserModel       = require('./Models/UserModel');
const AuthController  = require('./Controllers/AuthController');

const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Discussion.db');

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

app.listen(80, 
    () => console.log(`Listening on port: ${PORT}`));