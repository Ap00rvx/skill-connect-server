const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connect = require('./database/connect')
const gauth = require("./routes/gAuth.routes")


dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const port = 3000 || process.env.PORT
connect()

app.use('/', gauth)





app.get('/', (req, res) => res.send('Hello World!'))
app.get('/ping', (req, res) => res.send('Test Route!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))