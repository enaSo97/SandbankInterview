const { response } = require('express');
const firebase = require('./firebase');
const mysql = require('mysql');

// for security purose, these can go in the .env file and gitignore the .env file

const con = mysql.createConnection({
    host: "sandbank-ena.cofdaw3zgftv.ca-central-1.rds.amazonaws.com",
    user: "admin",
    password: "enaso1227",
    port: 3306,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    //con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    //con.query('DROP TABLE orders');

    con.query('SELECT * FROM users', (err, result, field) => {
        console.log(result);
    })
    //con.query('ALTER TABLE orders ADD COLUMN instrument_id VARCHAR(50) AFTER id;');
    /*con.query('CREATE TABLE IF NOT EXISTS orders(id int NOT NULL AUTO_INCREMENT, instrument_id VARCHAR(50), orderPrice float, orderSize int, finalPrice float, finalSize int, boughtAt DATETIME, PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });*/
    //con.end();
});

const identifyToken = (token, res) => {
    // created promise to avoid sending multiple headers 
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE accessToken='${token}'`, (err,rows) => {
            if(err) reject(err);
            if (rows.length){
                resolve(true);
            }else{
                resolve(false);
            }
        })
    })
    
}


const addOrder = (order) => {
    //const date = new Date()
    const currUser = firebase.auth().currentUser; // possibly add user info, who bought the purchase in the db as well, set uid as a foreign key 
    con.query(`INSERT INTO main.orders (instrument_id, orderPrice, orderSize, finalPrice, finalSize, boughtAt) VALUES ('${order.instrument_id}', '${order.price}', '${order.size}', '${order.finalPrice}', '${order.finalSize}', '${order.boughtAt}')`, (err, rows) => {
        if (err) console.log("errrr: ", err);
        if (rows) {
            console.log("row inserted successfully");
        }
    });
}

const getOrderAfterBaseTime = (base_time, res, callback) => {
    const time = new Date(base_time).toISOString().slice(0, 19); // converting the utc time format to MySQL datetime format :)
    // here, you would only return the orders that current user bought, so query would also filter with WHERE uid = current user
    const result = con.query(`SELECT * FROM orders WHERE boughtAt > DATE('${time}')`, (err, rows)=>{
        if (err) throw err;
        if (rows) {
            callback(rows, res);
        }
    });
    return result;
}

module.exports = {
    addOrder,
    getOrderAfterBaseTime,
    identifyToken,
}