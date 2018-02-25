const apiURL = 'https://api.coinmarketcap.com/v1/ticker/';

export default () => {
  return fetch(apiURL).then(response => response.json());
};
