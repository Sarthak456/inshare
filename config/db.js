require('dotenv').config();                //importing dotenv

const mongoose = require('mongoose');    //importing mongoose

function connectDB(){                    //runs when database get connected
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useUnifiedTopology: true});
    const connection = mongoose.connection;

    connection.once('open', function () {
      console.log('MongoDB running.');
    }).on('error', function (err) {
      console.log(err);
    });
}

module.exports = connectDB;