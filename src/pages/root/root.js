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
      </div>
    );
  }
}

export default Root;
