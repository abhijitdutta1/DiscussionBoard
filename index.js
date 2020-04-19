const express          = require('express');
const app              = express();
const path             = require('path');
const redis            = require('redis');
const session          = require('express-session');
const RedisStore       = require('connect-redis')(session);
const winston        = require('winston');

const createDAO        = require('./Models/dao');
const UserModel        = require('./Models/UserModel');
const AuthController   = require('./Controllers/AuthController');
const ClassModel       = require('./Models/ClassModel');
const DiscussionModel  = require('./Models/DiscussionModel');
const RepliesModel     = require('./Models/RepliesModel');
const Reply2replyModel = require('./Models/Reply2ReplyModel');

const redisClient = redis.createClient();

/*
        Session
*/
const sess = session({
    store: new RedisStore({ 
        client: redisClient, // our redis client
        host: 'localhost',   // redis is running locally on our VM (we don't want anyone accessing it)
        port: 6379,          // 6379 is the default redis port (you don't have to set this unless you change port)
        ttl: 12 * 60 * 60,   // Time-To-Live (in seconds) this will expire the session in 12 hours
    }),
    secret: 'astate web-dev', // Use a random string for this in production
    resave: false, 
    cookie: {
        httpOnly: true,
    },
    saveUninitialized: false, // set this to false so we can control when the cookie is set (i.e. when the user succesfully logs in)
});

// This parses the cookie from client's request
// it parse the cookie before any routes are handled or 
// application middleware kicks in
app.use(sess);


/*
        Initialize logger
*/
// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json(),
    ),
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/info.log' })
    ]
});

const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Discussion.db');
let Auth   = undefined;

// gives direct access to GET files from the "public" directory 
app.use(express.static('public'));

// We add this to the middleware so it logs every request
// don't do this in production since it will log EVERYTHING (including passwords)
app.use((req, res, next) => {
    logger.info(`${req.ip}|${req.method}|${req.body || ""}|${req.originalUrl}`);
    next();
});

// need this line so express can parse the POST data the browser
// automatically sends
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 80;

app.get('/', (req, res, next) => {
    if (!req.session.name) {
        req.session.name  = req.query.name;
    }
    // req.session.views = req.session.views ? req.session.views+1 : 1;

    // console.log(`current views:`);
    // console.log(req.session);
    next();
});

/*
        Login
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/login.html'));
});

/*
        Signup
*/
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/signup.html'));
});


/*
        Error Pages
*/
// This sends back the error page
app.get('/error', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'error.html')));
// which hits this route to get a random error gif
app.get('/error_background', (req, res) => {
    const gifNum = Math.floor(Math.random() * 10) + 1;
    res.sendFile(path.join(__dirname, 'public', 'images', `error${gifNum}.gif`));
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

// This is our default error handler (the error handler must be last)
// it just logs the call stack and send back status 500
app.use(function (err, req, res, next) {
    console.error(err.stack)
    logger.error(err);
    res.redirect('/error');
});

// We just use this to catch any error in our routes so they hit our default
// error handler. We only need to wrap async functions being used in routes
function errorHandler (fn) {
    return function(req, res, next) {
      return fn(req, res, next).catch(next);
    };
};