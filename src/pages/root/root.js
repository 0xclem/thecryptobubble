import React, { Component } from 'react';
import './root.css';
import api from '../../api';
import BubbleChart from '../../components/bubble-chart';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      coins: null,
    };
  }
  componentDidMount() {
    api().then(response => {
      this.setState({ coins: response });
    });
  }

  renderChart() {
    const { coins } = this.state;
    return coins ? <BubbleChart data={coins} /> : null;
  }

  render() {
    const { coins } = this.state;
    return (
      <div className="Root">
        <h1 className="RootHeadline">The crypto bubble</h1>
        {this.renderChart()}
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
  }
}

export default Root;
