const express = require('express');
const app = express();
const path    = require('path');

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

// test
app.get('/iCourse', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/iCourse.html'));
});

app.get('/iDiscussion', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/iDiscussion.html'));
});

app.get('/sCourse', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/sCourse.html'));
});

app.get('/sDiscussion', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/sDiscussion.html'));
});

app.listen(80, 
    () => console.log(`Listening on port: ${PORT}`));