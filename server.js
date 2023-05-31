const express =require('express');            //import express

const app = express();                        //storing express functions in app variable

const path = require('path');

const PORT = process.env.PORT || 3000;        //assigning value to PORT variable

app.use(express.static('public'));

app.use(express.json());


const connectDB = require("./config/db");
connectDB();

//Templete Engine

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Routes
app.use('/api/files', require('./routes/files'));          //sending url of types /api/files to files.js of routes
app.use('/files',require('./routes/show'));                //sending url of type /files to show.js of routes
app.use('/files/download', require('./routes/download'));

app.listen(PORT, ()=>{                        //running app on the port value PORT
    console.log(`listening on ${PORT}`);
})