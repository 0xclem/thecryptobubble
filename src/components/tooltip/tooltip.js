import React from 'react';
import PropTypes from 'prop-types';
import { humanizeNumber } from '../../helpers';
import './tooltip.css';

const Tooltip = ({ coin, onCloseButtonClick }) => {
  return coin ? (
    <div className="tooltip">
      <div className="tooltipInner">
        <div onClick={onCloseButtonClick} className="closeButton">
          X
        </div>
        <h3>
          {coin.name}({coin.symbol})
        </h3>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Rank: </span>
          <span className="tooltipRowValue">#{coin.index + 1}</span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Market Cap: </span>
          <span className="tooltipRowValue">
            ${humanizeNumber(coin.market_cap_usd)}
          </span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Current USD Price: </span>
          <span className="tooltipRowValue">${coin.price_usd}</span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Current BTC Price: </span>
          <span className="tooltipRowValue tooltipRowValueWithImage">
            <img
              width="19"
              height="17"
              src={`${process.env.PUBLIC_URL}/img/bitcoin.svg`}
            />
            <span> {coin.price_btc}</span>
          </span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Last hour: </span>
          <span className="tooltipRowValue">${coin.percent_change_1h}%</span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Last 24h: </span>
          <span className="tooltipRowValue">${coin.percent_change_24h}%</span>
        </div>
        <div className="tooltipRow">
          <span className="tooltipRowLabel">Last 7d: </span>
          <span className="tooltipRowValue">${coin.percent_change_7d}%</span>
        </div>
        <div className="tooltipRow tooltipLastRow">
          <a
            className="tooltipLink"
            href={`https://coinmarketcap.com/currencies/${coin.name}/`}
            target="_blank"
          >
            See on coinmarketcap.com
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

Tooltip.propTypes = {
  coin: PropTypes.object,
  onCloseButtonClick: PropTypes.func.isRequired,
};

export default Tooltip;
