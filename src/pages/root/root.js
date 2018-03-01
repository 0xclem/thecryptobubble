import React, { Component } from 'react';
import './root.css';
import api from '../../api';
import BubbleChart from '../../components/bubble-chart';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      coins: null,
      global: null,
    };
    this.interval = null;
    this.getData = this.getData.bind(this);
  }

  getData() {
    api().then(([coins, global]) => {
      this.setState({ coins, global });
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
    const { coins } = this.state;
    return coins ? <BubbleChart data={coins} /> : null;
  }

  humanizeNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {
    const { coins, global } = this.state;
    if (coins && global) {
      return (
        <div className="Root">
          <h1 className="RootHeadline">The crypto bubble</h1>
          <h2 className="RootSubHeadline">
            Total Market Cap: ${this.humanizeNumber(
              global.total_market_cap_usd
            )}
          </h2>
          {this.renderChart()}
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
          <div className="footer">
            <span>Made with love in Sydney</span>
            <a href="https://www.linkedin.com/in/clementbalestrat/">
              <img height="25" src="/img/linkedin.svg" />
            </a>
            <a href="https://github.com/clementbalestrat/thecryptobubble">
              <img height="25" src="/img/github.svg" />
            </a>
          </div>
        </div>
      );
    } else return null;
  }
}

export default Root;
