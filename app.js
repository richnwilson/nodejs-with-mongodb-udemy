'use strict'
const express = require('express');
const { engine } = require('express-edge');
const edge = require('edge.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require('connect-flash');

// References to our express code for routes
const createPostContoller = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const postStoreController = require('./controllers/postStore');
const aboutPostController = require('./controllers/aboutPost');
const getPostController = require('./controllers/getPost');
const getContactController = require('./controllers/getContact');
const createUserController = require('./controllers/createUser');
const postUserController = require('./controllers/postUser');
const loginController = require('./controllers/login');
const postUserLoginController = require('./controllers/loginUser');
const logoutUserController = require('./controllers/logoutUser');

const app = express();

require('dotenv').config();

// This library allows the session engine to remain persistent for a period of time, and not based on browser closing or server restarting
const mongoStore = connectMongo(expressSession);

// Need this before we assign the mongoStore value above to the expressSession middleware below
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

/*
-------------- ALL EXPRESS MIDDLEWARE HERE
*/

// Where to find statich files (assets)
app.use(express.static('public'))

// Accept data in express using body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Add Edge templating engine
app.use(engine);

// This will allow session to persist for only one call and not persistent
app.use(connectFlash());

// Session middleware - creates connect.sid cookie for domain
app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60, // Force the session to expire in 60 seconds but if uses engages with server, extend
    autoRemove: 'native'
  }) // This actually create a session document in MongoDB to store that user session value
}))

// Use edge.js middleware to store global edge values to use in all (*) templates
app.use('*', (req,res,next) => {
  edge.global('auth', req.session.userId);
  edge.global('username', req.session.username);
  next()
})
/*
  ALWAYS INCLUDE MIDDLEWARE FUNCTIONS FOR 'APP' HERE - BEFORE NEEDED IN GET/POST BELOW **AND** AFTER GLOBAL MIDDLEWARE ABOVE i.e. TO STORE DATA IN JSON
  REMEMBER THESE ARE EXECUTED BEFORE GET/POST
  -- SEE customMiddleware below
*/
const customMiddleware = require('./middleware/aboutPost');
// We apply this custom middleware as 2nd parameter in get/post calls below
// - If multiple middleware, just comma separate

const auth = require('./middleware/auth');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

/*
-------------- DONE EXPRESS MIDDLEWARE
*/

// Set views to use Edge files stored in 'views' sub-folder - referenced by res.render in app.get
app.set('views',`${__dirname}/views`);
app.set('port',process.env.EXPRESS_PORT);


app.get('/',homePageController);
app.get('/post/new',auth, createPostContoller);
app.post('/post/store',auth, postStoreController);
// Example to show two levels of middleware
app.get('/about',auth, customMiddleware, aboutPostController);
app.get('/post/:id',getPostController);
app.get('/contact',getContactController);
// Only show login related pages if not already logged in (session Id). If so, redirect to home
app.get('/auth/register',redirectIfAuthenticated, createUserController);
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/register',redirectIfAuthenticated, postUserController);
app.post('/users/login',redirectIfAuthenticated, postUserLoginController);
app.get('/auth/logout', auth, logoutUserController);

// THIS IS ALWAYS AT END OF THE ROUTES AND WILL USE FOR PAGE NOT FOUND
app.use((req,res) => res.render('404'));

app.listen(app.get('port'),()=> {
    console.log(`Server listening on port ${app.get('port')}`)
})