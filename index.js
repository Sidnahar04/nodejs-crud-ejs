const express = require('express');
//import my db connection
const db = require('./utilities/db-connection')

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

//testing connnection to db
db.connect((err)=>{
    if(err) throw err;
    console.log('Database connected');
});

app.listen(port, ()=>{
    console.log("Server is running");
});