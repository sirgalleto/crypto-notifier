#!/usr/bin/env node

const program = require('commander');
const config = require('./config/default.json');
const start = require('./index');

const currenciesAvailable = config.currencies;

function list(val) {
    return val.split(',');
}

program
    .version('0.0.1')
    .option('-T, --time [time]', 'time to update in ms')
    .option(
        '-C, --currencies [currencies]',
        `currencies to notify separated by comma. Currencies available: ${currenciesAvailable}`,
        list
    )
    .parse(process.argv);

start({
    timeToUpdate: program.time,
    currencies: program.currencies
});
