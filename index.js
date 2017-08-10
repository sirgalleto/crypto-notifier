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
    try {
        const prices = await scrapCurrencies();
        const lastPrices = db.getState();

        currencies.forEach((currency, index) => {
            const displayCurrencyName = currency.split('_').join(' ').toUpperCase();
            const price = Number(prices[currency]);
            const lastPrice = Number(lastPrices[currency]);

            const stable = price === lastPrice;

            if (!stable) {
                const increase = price > lastPrice;
                const percent = calculatePercent(price, lastPrice).toFixed(4);

                const notificationOptions = {
                    title: `${displayCurrencyName}: $${prices[currency]}`,
                    message: `${increase ? 'UP' : 'DOWN'} by ${percent}%`,
                };

                setTimeout(() => {
                    notifier.notify(notificationOptions);
                }, 5000 * index);
            } else {
                console.info(`${displayCurrencyName} is stable`);
            }
        });

        db.setState(prices);
    } catch (e) {
        console.error('There was a problem updating the values');
    } finally {
        setTimeout(start, 60000);
    }
}

function calculatePercent(newPrice, oldPrice) {
    const increaseValue = newPrice - oldPrice;
    return (increaseValue / oldPrice) * 100;
}

start();