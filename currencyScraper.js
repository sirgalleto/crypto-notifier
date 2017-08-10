const scrapeIt = require('scrape-it');

module.exports = async function() {
    const data = await scrapeIt('https://bitso.com', {
        lastPrice: {
            selector: '#lastPrice',
            convert: data => JSON.parse(data),
        },
    });

    console.info(`Price at ${new Date()}: ${JSON.stringify(data.lastPrice, null, 4)}`);

    return data.lastPrice;
}