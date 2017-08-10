const notifier = require('node-notifier');
const NotificationCenter = require('node-notifier/notifiers/notifysend');
const formatNum = require('format-num')
const scrapCurrencies = require('./currencyScraper');

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

    currencies.forEach((currency, index) => {
        const notificationOptions = {
            title: currency.toUpperCase(),
            message: `$${prices[currency]}`,
            timeout: 1000,
            wait: true
        };

        setTimeout(() => {
            notifier.notify(notificationOptions);
        }, 5000 * index);
    });

    setTimeout(start, 60000);
}

start();