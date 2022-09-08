const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: String,
    anime: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Anime'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)