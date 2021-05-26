const axios = require('axios');
const { getOrderAfterBaseTime } = require('./database');

const getOrderBook = async (inst_id) => {

    const orderBook = await axios({
        method: 'get',
        url: `https://www.okex.com/api/futures/v3/instruments/${inst_id}/book?size=100`,
        headers: {
            "contentType": "application/x-www-form-urlencoded",
            "User-Agent": "OKEX JavaScript API Wrapper"
        },
    });

    return orderBook.data;

} 

const getTicker = async () => {
    const Ticker = await axios({
        method: 'get',
        url: `https://www.okex.com/api/futures/v3/instruments/ticker`,
        headers: {
            "contentType": "application/x-www-form-urlencoded",
            "User-Agent": "OKEX JavaScript API Wrapper"
        },
    });

    return Ticker.data;
}

const calculateProfitAndLoss = async (orders, res) => {
    const ticker = await getTicker();
    //console.log(ticker);
    const result = orders.reduce((acc, order) => {
        const tickerInfo = ticker.find(el => el.instrument_id === order.instrument_id);
        const priceDiff = tickerInfo.last - order.finalPrice;
        const long = (tickerInfo.last * order.finalSize) - (order.finalPrice * order.finalSize);
        const short = (order.finalPrice * order.finalSize) - (tickerInfo.last * order.finalSize);
        acc.push({
            priceDiff: priceDiff,
            long: long,
            short: short,
            
        })
        return acc;
    }, []);
    //console.log(result);
    res.json(result);
}


module.exports = {
    getOrderBook,
    getTicker,
    calculateProfitAndLoss,
}