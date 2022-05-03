const mongoose = require('mongoose');
const { DB } = process.env;

exports.connect = () => {
    //connection to database
    mongoose
        .connect(DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Mongodb database connected')
        })
        .catch((error) => {
             console.log('Database connection failed. exiting now...')
             console.log(error)
        })
}

