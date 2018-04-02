import React, { Component } from 'react';
import './root.css';
import api from '../../api';
import BubbleChart from '../../components/bubble-chart';
import Tooltip from '../../components/tooltip';
import { humanizeNumber } from '../../helpers';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      coins: null,
      global: null,
      sort: 'marketcap',
      needsRedraw: true,
      selectedCoin: null,
    };
    this.interval = null;
    this.getData = this.getData.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.handleBubbleClick = this.handleBubbleClick.bind(this);
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);
  }

  handleBubbleClick(coin) {
    this.setState({ selectedCoin: coin, needsRedraw: false });
  }

  handleCloseButtonClick() {
    this.setState({ selectedCoin: null });
  }

  getData() {
    api().then(([coins, global]) => {
      this.setState({ coins, global, needsRedraw: true });
    });
  }
  componentDidMount() {
    this.getData();
    this.interval = setInterval(this.getData, 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderChart() {
    const { coins, needsRedraw, sort } = this.state;
    return coins ? (
      <BubbleChart
        needsRedraw={needsRedraw}
        data={coins}
        onBubbleClick={this.handleBubbleClick}
        sortBy={sort}
      />
    ) : null;
  }

  toggleSort(sort) {
    return e => {
      this.setState({ sort, needsRedraw: true });
    };
  }

  renderButtons() {
    const { sort } = this.state;
    return (
      <div className="buttonRow">
        <div
          className={`button ${sort === 'marketcap' ? 'active' : ''}`}
          onClick={this.toggleSort('marketcap')}
        >
          Market Cap
        </div>
        <div
          className={`button ${sort === 'last24h' ? 'active' : ''}`}
          onClick={this.toggleSort('last24h')}
        >
          Last 24h
        </div>
      </div>
    );
  }

  render() {
    const { coins, global, selectedCoin } = this.state;
    if (coins && global) {
      return (
        <div className="root">
          <h1 className="rootHeadline">The crypto bubble</h1>
          <h2 className="rootSubHeadline">
            Total Market Cap: ${humanizeNumber(global.total_market_cap_usd)}
          </h2>
          {this.renderButtons()}
          <div className="rootContent">
            {this.renderChart()}
            <Tooltip
              coin={selectedCoin}
              onCloseButtonClick={this.handleCloseButtonClick}
            />
          </div>
          <div className="footer">
            <div className="legend">
              <div className="legendRow">
                <div className="legendBubble" />
                <div>Up last 24 hours </div>
              </div>
              <div className="legendRow">
                <div className="legendBubble blue" />
                <div>Down last 24 hours </div>
              </div>
            </div>
            <div className="links">
              <a href="https://www.linkedin.com/in/clementbalestrat/">
                <img height="25" src="/img/linkedin.svg" />
              </a>
              <a href="https://github.com/clementbalestrat/thecryptobubble">
                <img height="25" src="/img/github.svg" />
              </a>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}

export default Root;
