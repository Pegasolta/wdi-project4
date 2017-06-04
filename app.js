require('dotenv').config({
    silent: true
})
var express = require('express')
var app = express()
var session = require('express-session')
var ejsLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)
var methodOverride = require('method-override')
var flash = require('connect-flash')
var passport = require('./config/passport')
// var isLoggedIn = require('./middleware/isLoggedIn')
var path = require("path")

// use sessions for tracking logins
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: process.env.MONGODB_URI
    })
}))

// initialize the passport configuration and session as middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// make user ID available in templates
app.use(function (req, res, next) {
    res.locals.currentUser = req.session.userId
    next()
})

// mongoose setup
if (process.env.NODE_ENV === 'test') {
    mongoose.connect('mongodb://localhost/wdi-project2')
} else {
    mongoose.connect(process.env.MONGODB_URI)
}
mongoose.Promise = global.Promise

// check if our connection is okay
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    // we're connected!
    console.log('really really connected')
})

// parse incoming requests
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// setup the ejs template
app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.use(require('morgan')('dev'))
app.use(function (req, res, next) {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next()
})

// // serve static files from /assets
// app.use(express.static('/assets'))

// setup the method override
app.use(methodOverride('_method'))

// INITIAL ROUTES
app.get('/backend', function (req, res, next) {
    res.render('backend', {
        title: 'Felix Tan Backend'
    })
    return
})

app.get("/", function(req, res, next) {
    res.render("userHome", {
        title: "Felix Tan"
    })
    return
})

// CONTROLLERS
app.use('/backend', require('./controllers/backendadmin'))
app.use('/', require('./controllers/frontend'))

var server
if (process.env.NODE_ENV === 'test') {
    server = app.listen(process.env.PORT || 4000)
} else {
    server = app.listen(process.env.PORT || 3300)
}

module.exports = server
