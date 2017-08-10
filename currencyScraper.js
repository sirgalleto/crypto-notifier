const scrapeIt = require('scrape-it');

module.exports = async function() {
    let data = await scrapeIt('https://bitso.com', {
        lastPrices: {
            selector: '#lastPrice',
        },
    });

    if (!data.lastPrices) {
        throw new Error('No data');
    }

    const lastPrices = JSON.parse(data.lastPrices);

    console.info(`Price at ${new Date()}:`);

    Object.keys(lastPrices).forEach((currency) => {
        console.info(
            `${currency.split('_').join(' ').toUpperCase()}: ${lastPrices[currency]}`
        );
    });

    return lastPrices;
}