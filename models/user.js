const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    anime: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Anime'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)