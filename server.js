const express = require("express")
const app = express();

// Middleware pour JSON

app.use(express.json());

require('dotenv').config();
PORT=process.env.PORT;


//connect to bd
const  connectDB=require("./config/connectDB");
connectDB();

app.use('/api/person', require('./route/Person'))



//connect port
app.listen(PORT, err =>{
    err ? console.log('fail to connect') : 
    console.log(`server running at ${PORT}`);
    })
    