const apiHandler = require('./api-handler');
const _ = require('lodash');

module.exports = async function(currencies) {
    const exchanges = await Promise.all(currencies.map(async (currency) => await apiHandler(currency)));

    const lastPrices = _.zipObject(
      _.map(exchanges, 'currency'),
      _.map(exchanges, 'exchange')
    );

    Object.keys(lastPrices).forEach((currency) => {
         console.info(
           `${currency.split('_').join(' ').toUpperCase()}: ${lastPrices[currency]}`
         );
    });
    
    return lastPrices;
}
