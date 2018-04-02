export const humanizeNumber = x => {
  const xFloat = parseFloat(x).toFixed(0);
  return xFloat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
