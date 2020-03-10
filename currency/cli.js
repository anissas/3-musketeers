#!/usr/bin/env node

const currency = require('./');
const ora = require('ora');

const argv = process.argv.slice(2);

/**
 * Demo which shows how to use the program
 * Here we convert 1650dkk to EUR 
 */
function help () {
  console.log(
    [
      '',
      '  Example',
      '    ❯ currency 1650 dkk eur',
      '    1650 DKK = 220.79486154 EUR',
      '',
      '  See README.md for detailed usage.'
    ].join('\n')
  );
}

const spinner = ora('Fetching exchange data..');

/**
 * Get the result of convertion from currency
 * Print the result
 */
async function start (opts) {
  try {
    const {amount, from, to} = opts;
    const result = await currency(opts);

    spinner.stop();
    console.log(`${amount} ${from} = ${result} ${to}`);
  } catch (error) {
    spinner.stop();
    console.log(error);
    process.exit(1);
  }
}

if (argv.indexOf('--help') !== - 1) {
  help();
  process.exit(0);
}

spinner.start();

//Initialise param of opts for the convertion
const opts = {
  'amount': argv[0] || 1,
  'from': (argv[1] || 'USD').toUpperCase(),
  'to': (argv[2] || 'BTC').toUpperCase()
};

start(opts);
