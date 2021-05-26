const { response } = require('express');
const mysql = require('mysql');


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

    con.query('SELECT * FROM orders', (err, result, field) => {
        console.log(result);
    })
    //con.query('ALTER TABLE orders ADD COLUMN instrument_id VARCHAR(50) AFTER id;');
    /*con.query('CREATE TABLE IF NOT EXISTS orders(id int NOT NULL AUTO_INCREMENT, instrument_id VARCHAR(50), orderPrice float, orderSize int, finalPrice float, finalSize int, boughtAt DATETIME, PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });*/
    //con.end();
});



const addOrder = (order) => {
    //const date = new Date()
    console.log("order: ", order);
    con.query(`INSERT INTO main.orders (instrument_id, orderPrice, orderSize, finalPrice, finalSize, boughtAt) VALUES ('${order.instrument_id}', '${order.price}', '${order.size}', '${order.finalPrice}', '${order.finalSize}', '${order.boughtAt}')`, (err, rows) => {
        if (err) console.log("errrr: ", err);
        if (rows) {
            console.log("row inserted successfully");
        }
    });
}

const getOrderAfterBaseTime = (base_time, res, callback) => {
    const time = new Date(base_time).toISOString().slice(0, 19);
    console.log(time);
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
}