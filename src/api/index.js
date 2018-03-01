const apiUrls = [
  'https://api.coinmarketcap.com/v1/ticker/',
  'https://api.coinmarketcap.com/v1/global/',
];

const fetchContent = url => {
  return fetch(url).then(response => response.json());
};

export default () => {
  return Promise.all(apiUrls.map(fetchContent));
};
