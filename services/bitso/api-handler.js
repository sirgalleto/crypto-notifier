const request = require('request-promise-native');
const _ = require('lodash');
const settings = require('./settings');

const parseResponse = response => new Promise((resolve, reject) =>{
  if (response.statusCode === 200 && _.has(response.body, 'payload')) {
    resolve({
      'currency': response.body.payload.book,
      'exchange': response.body.payload.last,
    });
  } else {
    reject(new Error());
  }
});


module.exports = async function(query) {
  settings.uri = `?book=${query}`;

  return parseResponse(await request(settings));
}
