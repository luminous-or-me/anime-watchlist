const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        watched: {
            type: Boolean,
            default: false
        }
    }
)

animeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Anime', animeSchema)