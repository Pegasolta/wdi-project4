var express = require('express')
var router = express.Router()
var User = require("../models/user")
var Post = require("../models/post")
var passport = require('../config/passport')
var isLoggedIn = require("../middleware/isLoggedIn")

// GET /logout
router.get('/logout', function(req, res) {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/backend')
})

// GET /signup
router.get('/signup', function(req, res) {
    res.render('backend/signup')
})

// POST /signup
router.post('/signup', function(req, res, next) {
    if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword) {
        // confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
            req.flash('error', 'Passwords do not match')
            return res.redirect('/backend/signup')
        }

        // create object with form input
        var newUser = new User({email: req.body.email, name: req.body.name, password: req.body.password})

        // use schema's `save` method to insert document into Mongo
        newUser.save(function(error, user) {
            if (error) {
                req.flash('error', 'Could not create user account, contact Felix')
                res.redirect('/backend/signup')
            } else {
                passport.authenticate('local', {
                    successRedirect: '/backend/admin',
                    successFlash: 'Account created and logged in'
                })(req, res)
            }
        })

    } else {
        req.flash('error', 'All fields required')
        return res.redirect('/backend/signup')
    }
})

// GET /login
router.get('/login', function(req, res) {
    res.render('backend/login')
})

// POST /login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/backend/admin',
    failureRedirect: '/backend/login',
    failureFlash: passport.message,
    successFlash: 'You have logged in'
}))

router.use(isLoggedIn)
// LOGGED IN ROUTE TYPES
// GET / Admin page
router.get('/admin', function(req, res) {
    res.render("backend/admin")
})

// POST /postSubmission form
router.post('/admin', function(req, res) {
    if (req.body.title && req.body.postText) {
        // create object with form input
        var newPost = new Post({title: req.body.title, postText: req.body.postText})

        // use schema's `save` method to insert document into Mongo
        newPost.save(function (error, user) {
            if (error) {
                req.flash('error', 'Could not publish post')
                res.redirect("/backend/admin")
            } else {
                res.render('postPublish')
            }
        })

    } else {
        req.flash('error', 'All fields required')
        return res.redirect("backend/admin")
    }
})

module.exports = router
