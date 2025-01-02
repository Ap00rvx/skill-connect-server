const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connect = require('./database/connect')
const gauth = require("./routes/gAuth.routes")
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')
const storage = require('./storage/storage')
const multer = require('multer')
const upload = multer({ storage });

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const port = 3000 || process.env.PORT
connect()
app.use(cookieParser())


app.use('/', gauth)
app.use('/api/user', userRoutes)





app.get('/', (req, res) => res.send('Hello World!'))
app.get('/ping', (req, res) => res.send('Test Route!'))
app.post("/upload",upload.single("file"),(req,res)=>{
    console.log(req.file);
    res.send({message:"File uploaded successfully!",url: req.file});
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))