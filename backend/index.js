const express = require('express');
require('dotenv').config();
const cors = require('cors')
const { PORT } = process.env;
const port = process.env.port || PORT;
require("./db").connect();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')
const app = express();

//middleware
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(cookieParser());

//routes
app.use(authRoutes);


app.listen(port,() => {
    console.log(`Server is running at PORT: ${port}`)
})
