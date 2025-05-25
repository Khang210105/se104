const express = require("express");
const dotenv = require('dotenv');
const  mongoose = require("mongoose");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config()

const app = express()
const port = process.env.PORT || 3001


app.use(cookieParser())
app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(()=>{
        console.log('Connect Database success')
    })
    .catch((err)=> {
        console.log(err)
    })

app.listen(port, ()=>{
    console.log('Server is running in port:', + port)
})