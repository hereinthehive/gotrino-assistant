const axios = require('axios');
const _ = require('lodash');

module.exports = {
  fetch: (url) => axios.get(url),
  merge: (a, b) => _.merge(a, b),
};
