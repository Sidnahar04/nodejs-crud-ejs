const mysql=require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'CPRG212',
    password: 'Cprg212user'
})

module.exports=connection;