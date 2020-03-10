const axios = require('axios');
const money = require('money');

const RATES_URL = 'https://api.exchangeratesapi.io/latest';
const BLOCKCHAIN_URL = 'https://blockchain.info/ticker';
const CURRENCY_BITCOIN = 'BTC';

const isAnyBTC = (from, to) => [from, to].includes(CURRENCY_BITCOIN);

/**
 * convert money to money
 * Here we convert 1 USD to BTC
 * @param  {opts}
 * @return money.convert(amount, conversionOpts)
 */
module.exports = async opts => {

/**
 * amount = number that we want to convert
 * from = converts from 
 * to = converts to
 */
  const {amount = 1, from = 'USD', to = CURRENCY_BITCOIN} = opts;
  const promises = [];
  let base = from;

  const anyBTC = isAnyBTC(from, to);

  if (anyBTC) {
    base = from === CURRENCY_BITCOIN ? to : from; //if base is BTC then to else from
    promises.push(axios(BLOCKCHAIN_URL)); //fill promises with the json in the blockchain_url
  }

  promises.unshift(axios(`${RATES_URL}?base=${base}`)); // get the rates depending on the base

  try {
    const responses = await Promise.all(promises);
    const [rates] = responses;

    money.base = rates.data.base; 
    money.rates = rates.data.rates; 

    const conversionOpts = {
      from,
      to
    };

    if (anyBTC) {
      const blockchain = responses.find(response =>
        response.data.hasOwnProperty(base)
      );

      Object.assign(money.rates, {
        'BTC': blockchain.data[base].last
      });
    }

    if (anyBTC) {
      Object.assign(conversionOpts, {
        'from': to,
        'to': from
      });
    }

    return money.convert(amount, conversionOpts);
  } catch (error) {
    throw new Error (
      '💵 Please specify a valid `from` and/or `to` currency value!'
    );
  }
};
