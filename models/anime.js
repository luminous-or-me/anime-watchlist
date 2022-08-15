const mongoose = require('mongoose')

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
    .then(result => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))

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
            required: true,
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