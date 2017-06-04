var express = require('express')
var router = express.Router()
var Post = require("../models/post")
var path = require("path")

// GET /Frontend routes
router.get("/musings", function (req, res) {
    Post.find([], function (err, postAll) {
        if (err) {
            req.flash('error', 'Could not load posts')
        } else {
            res.render("frontend/musings", {postAll: postAll})
        }
    })
})

router.get('/:categoryId', function (req, res) {
    res.render(path.join('frontend', req.params.categoryId))
})

module.exports = router
