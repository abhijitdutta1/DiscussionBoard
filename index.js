const express            = require('express');
const app                = express();
const path               = require('path');
const redis              = require('redis');
const session            = require('express-session');
const RedisStore         = require('connect-redis')(session);
const winston            = require('winston');

const createDAO          = require('./Models/dao');
const UserModel          = require('./Models/UserModel');
const AuthController     = require('./Controllers/AuthController');
const UserController     = require('./Controllers/UserController');
const ClassModel         = require('./Models/ClassModel');
const Student2ClassModel = require('./Models/Student2ClassModel');
const DiscussionModel    = require('./Models/DiscussionModel');
const RepliesModel       = require('./Models/RepliesModel');
const Reply2replyModel   = require('./Models/Reply2ReplyModel');

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

// app.get('/', (req, res, next) => {
//     if (!req.session.name) {
//         req.session.name  = req.query.name;
//     }
//     next();
// });

/*
        Student
*/
app.get('/registeredCourses', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        // retrieve class with student email
        const rows = await Student2Class.searchClassByStudent(req.session.email);     
        res.send(JSON.stringify({classes: rows, username: req.session.name.name}));
    } else {
        res.redirect('/');
    }
}));

app.get('/sCourse', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'sCourse.html'));
    } else {
        res.redirect('/');
    }
}));

app.post('/sCourse', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        // search class
        const course = await Classes.searchClassByID(req.body.code);
        if(course) {
            // register class
            try {
                await Student2Class.registerStudent(course["classID"], req.session.email);
                return res.sendStatus(200);
            } catch (err) { // student is already registered with the class
                if (err.code === 'SQLITE_CONSTRAINT') {
                    console.error(err);
                    logger.error(err);
                    return res.sendStatus(409); // 409 Conflict
                } else {
                    throw err;
                }
            }
        } else { // class not found
            return res.sendStatus(404);
        }
    } else {
        res.redirect('/');
    }
}));

app.get('/sDiscussion-list/:classID', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        // retrieve discussion with class 
        rows = await Diss.SearchQuestion(req.params.classID);
        // retrieve class
        row = await Classes.searchClassByID(req.params.classID);
        res.send(JSON.stringify({discussions: rows, course: row.name}));
    } else {
        res.redirect('/');
    }
}));

app.get('/sCourse/:classID/sDiscussion', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'sDiscussion.html'));
    } else {
        res.redirect('/');
    }
}));

/*
        Instructor
*/
app.get('/iCourse', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 2) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'iCourse.html'));
    } else {
        res.redirect('/');
    }
}));

app.post('/iCourse', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 2) {
        const body = req.body;

        console.log(body);
        console.log(body.classID);
        console.log(body.name);
        console.log(body.description);

        if (body === undefined || (!body.classID || !body.name || !body.description)) {
            return res.sendStatus(400);
        }

        const {classID, name, description} = body;
        const email = req.session.email;

        try {
            await Classes.addClass(classID, name, description, email);
            res.sendStatus(200);
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                console.error(err);
                res.sendStatus(409); // 409 Conflict
            } else {
                throw err;
            }
        }
    } else {
        res.redirect('/');
    }
}));

app.get('/iCourse-list', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 2) {
        // retrieve class with instructor email
        const rows = await Classes.searchClassByEmail(req.session.email);     
        res.send(JSON.stringify({classes: rows, username: req.session.name.name}));
    } else {
        res.redirect('/');
    }
}));

app.get('/iCourse/iDiscussion', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 2) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'iDiscussion.html'));
    } else {
        res.redirect('/');
    }
}));

app.post('/iCourse/iDiscussion', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 2) {
        const body = req.body;

        console.log(body);
        console.log(body.question);
        console.log(body.datetimepicker1);
        console.log(body.description);

        if (body === undefined || (!body.question || !body.datetimepicker1 || !body.description)) {
            return res.sendStatus(400);
        }

        const {question, datetimepicker1, description} = body;
        const classID =""; //TODO 

        try {
            await Diss.addDiscussion(classID, question, datetimepicker1, description);
            res.sendStatus(200);
        }catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                console.error(err);
                res.sendStatus(409); // 409 Conflict
            } else {
                throw err;
            }
        }
    } else {
        res.redirect('/');
    }
}));

/*
        Login
*/
app.get('/', errorHandler(async (req, res) => {
    if (req.session.isVerified && req.session.isInstructor === 1) {
        res.redirect('/sCourse');
    } else if (req.session.isVerified && req.session.isInstructor === 2) {
        res.redirect('/iCourse');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
    }
}));

app.post('/login', errorHandler( async (req, res) => {
    if (req.body === undefined || (!req.body.email || !req.body.password)) {
        return res.sendStatus(400);
    }

    const {email, password, isInstructor} = req.body;
    const isVerified = await Auth.login(email, password, isInstructor);
    const status = isVerified ? 303 : 401;
    req.session.isVerified = isVerified;

    // TODO: Set the user's ID on their session object
    if (isVerified) {
        req.session.email = email;
        req.session.name = await Users.getName(email);
        req.session.isInstructor = parseInt(isInstructor);
        req.session.uuid = await Users.getUserID(email);
    }
    
    res.sendStatus(status);
}));

/*
        Signup
*/
app.get('/signup', errorHandler(async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
}));

app.post('/signup', errorHandler(async (req, res) => {
    const body = req.body;

    if (body === undefined || (!body.email || !body.password)) {
        return res.sendStatus(400);
    }

    const {email, fullName, password, isInstructor} = body;

    try {
        await Auth.register(email, fullName, password, isInstructor);
        res.sendStatus(200);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            console.error(err);
            logger.error(err);
            res.sendStatus(409); // 409 Conflict
        } else {
            throw err;
        }
    }
}));

/*
        logout
*/
app.post('/logout', (req, res) => {
    req.session.isVerified = false;
    res.sendStatus(200);
})

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
    console.log('Listening on port 80.');
});

async function initDB () {
    const dao = await createDAO(dbFilePath);
    Users = new UserModel(dao);
    await Users.createTable();
    Classes = new ClassModel(dao);
    await Classes.createTable();
    Diss = new DiscussionModel(dao);
    await Diss.createTable();
    Student2Class = new Student2ClassModel(dao);
    await Student2Class.createTable();
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