require('dotenv').config()
const http = require('http')
const app = require('./app')

http.createServer(app)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})