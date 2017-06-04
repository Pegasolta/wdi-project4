var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    postText: {
        type: String,
        required: true,
        trim: true
    }
})

PostSchema.pre('save', function(next) {
    var post = this

    // Only hash the password if it has been modified (or is new)
    if (!post.isModified('password')) return next()

    //hash the password
    var hash = bcrypt.hashSync(post.password, 10)

    // Override the cleartext password with the hashed one
    post.password = hash
    next()
})

PostSchema.methods.validPassword = function (password) {
    // Compare is a bcrypt method that will return a boolean,
    return bcrypt.compareSync(password, this.password)
}

PostSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        // delete the password from the JSON data, and return
        delete ret.password
        return ret
    }
}

module.exports = mongoose.model('Post', PostSchema)
