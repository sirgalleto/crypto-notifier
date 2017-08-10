const notifier = require('node-notifier');
const NotificationCenter = require('node-notifier/notifiers/notifysend');
const formatNum = require('format-num')
const scrapCurrencies = require('./currencyScraper');
const db = require('./db');

const currencies = [
    'btc_mxn',
    "eth_mxn",
    "xrp_btc",
    "xrp_mxn",
    "eth_btc",
    "bch_btc",
];

async function start() {
    const prices = await scrapCurrencies();
    const lastPrices = db.getState();

    currencies.forEach((currency, index) => {
        const price = Number(prices[currency]);
        const lastPrice = Number(lastPrices[currency]);

        const stable = price === lastPrice;
        const increase = price > lastPrice;
        const percent = calculatePercent(price, lastPrice).toFixed(3);

        const notificationOptions = {
            title: `${currency.split('_').join(' ').toUpperCase()}: $${prices[currency]}`,
            message: stable ? 'STABLE' : `${increase ? 'UP' : 'DOWN'} by ${percent}%`,
            timeout: 6000,
            wait: true
        };

        setTimeout(() => {
            notifier.notify(notificationOptions);
        }, 5000 * index);
    });

    db.setState(prices);
    setTimeout(start, 60000);
}

function calculatePercent(newPrice, oldPrice) {
    const increase = newPrice > oldPrice;

    if (increase) {
        const increaseValue = newPrice = oldPrice;
        return increaseValue + (oldPrice * 100);
    } else {
        const decreaseValue = oldPrice - newPrice;
        return decreaseValue / (newPrice * 100)
    }
}

start();