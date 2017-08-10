const lowdb = require('lowdb');

const db = lowdb('./db.json');

db.defaults({
    btc_mxn: null,
    eth_mxn: null,
    xrp_btc: null,
    xrp_mxn: null,
    eth_btc: null,
    bch_btc: null,
}).write();

module.exports = db;