const express = require('express');
const router = express.Router();
const Utils = require('./util');
const DatabaseService = require('./database');
const mysql = require('mysql');

router.post('/order', async (req, res) => {
    const { token, instrument_id, size, price, type1, type2 } = req.body
    //console.log(instrument_id, size, price, type1, type2);
    
    var orderData = await Utils.getOrderBook(instrument_id);
    var { asks, bids } = orderData;
    var finalOrder = [];
    //console.log(bids);
    switch (type2) {
        case "limit": // 지정가
            switch (type1) {
                case "long":
                    var i = 0;
                    var sizeToBuy = size;
                    while (sizeToBuy > 0) {
                        if (i === asks.length){
                            orderData = await Utils.getOrderBook(instrument_id);
                            console.log(orderData.asks);
                            asks = orderData.asks;
                            i = 0;
                        }
                        if (asks[i][0] <= price) {
                            sizeToBuy -= asks[i][3];
                            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            const order = {
                                price: price,
                                size: size,
                                finalPrice: asks[i][0],
                                finalSize: asks[i][3],
                                boughtAt: date,
                                instrument_id: instrument_id,
                            }
                            console.log("order in features : ", order);
                            finalOrder.push(order);
                            console.log(DatabaseService.addOrder(order));
                        }
                        i += 1; // increment i to iterate ask array
                    }
                    break;
                case "short":
                    var i = 0;
                    var sizeToBuy = size;
                    while (sizeToBuy > 0) {
                        if (i === asks.length){
                            orderData = await Utils.getOrderBook(instrument_id);
                            //console.log(orderData.bids);
                            bids = orderData.bids;
                            i = 0;
                        }
                        if (bids[i][0] >= price) {
                            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            sizeToBuy -= bids[i][3];
                            const order = {
                                price: price,
                                size: size,
                                finalPrice: bids[i][0],
                                finalSize: bids[i][3],
                                boughtAt: date,
                                instrument_id: instrument_id,
                            }
                            finalOrder.push(order);
                            console.log(price, size, bids[i][0], bids[i][3]);
                            DatabaseService.addOrder(order);
                        }
                        i += 1; // increment i to iterate bid array
                    }
                    break;
            }
            break;
        case "market": // 시장가
            switch (type1){
                case "long":
                    var i = 0;
                    var sizeToBuy = size;
                    while(sizeToBuy > 0){
                        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        sizeToBuy -= asks[i][3];
                        const order = {
                            price: price,
                            size: size,
                            finalPrice: asks[i][0],
                            finalSize: asks[i][3],
                            boughtAt: date,
                            instrument_id: instrument_id,
                        }
                        finalOrder.push(order);
                        console.log(price, size, asks[i][0], asks[i][3]);
                        DatabaseService.addOrder(order);
                        i += 1;
                    }
                    break;
                case "short":
                    var i = 0;
                    var sizeToBuy = size;
                    while(sizeToBuy > 0){
                        //const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        sizeToBuy -= bids[i][3];
                        const order = {
                            price: price,
                            size: size,
                            finalPrice: bids[i][0],
                            finalSize: bids[i][3],
                            instrument_id: instrument_id,
                        }
                        finalOrder.push(order);
                        console.log(price, size, bids[i][0], bids[i][3]);
                        DatabaseService.addOrder(order);
                        i += 1;

                    }
            }
            break;
    }
    res.json(finalOrder);
})

router.get('/fetch', async (req, res) => {
    const {token, baseTime } = req.body;
    //const lastPrice = orderBook.data[4].last;
    DatabaseService.getOrderAfterBaseTime(baseTime, res, Utils.calculateProfitAndLoss);
})

module.exports = router;