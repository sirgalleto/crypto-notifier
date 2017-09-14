const _ = require('lodash');
const path = require('path');
const notifier = require('node-notifier');
const formatNum = require('format-num');
const db = require('./db');
const getBitsoExchange = require('./services/bitso');
const defaultProps = require('./config/defaultProps.json');

const increaseIcon = 'increase.png';
const decreaseIcon = 'decrease.png';

module.exports = async function start(props) {
    const _props = _.defaults(props, defaultProps);

    try {
        const previousPrices = db.getState();
        const prices = await getBitsoExchange(_props.currencies);

        _props.currencies.forEach((currency, index) => {
            const displayCurrencyName = currency.split('_').join(' ').toUpperCase();
            const displayPrice = prices[currency];

            const price = Number(prices[currency]);
            const previousPrice = Number(previousPrices[currency]);

            const stable = price === previousPrice;

            if (!stable) {
                const increase = price > previousPrice;
                const percent = calculatePercent(price, previousPrice).toFixed(4);

                const notificationOptions = {
                    title: `${displayCurrencyName}: $${displayPrice}`,
                    message: !previousPrice ? ' ' : `${percent}%`,
                    icon: path.join(__dirname, 'icons', Boolean(increase) ? increaseIcon : decreaseIcon),
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
        console.error(e.name + ': ' + e.message);
    } finally {
        setTimeout(() => start(props), _props.timeToUpdate);
    }
}

function calculatePercent(newPrice, oldPrice) {
    const increaseValue = newPrice - oldPrice;
    return (increaseValue / oldPrice) * 100;
}
