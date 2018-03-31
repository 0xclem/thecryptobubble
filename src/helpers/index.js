export const humanizeBigNumber = x => {
  const xFloat = parseFloat(x).toFixed(0);
  return xFloat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const humanizeNumber = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
