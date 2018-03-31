import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './bubble-chart.css';
import { select, event } from 'd3-selection';
import { scaleLog } from 'd3-scale';
import { max, min } from 'd3-array';
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
} from 'd3-force';
import { drag } from 'd3-drag';
import { interpolate } from 'd3-interpolate';
import { transition } from 'd3-transition';

class BubbleChart extends Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight - 100,
      selectedBubble: null,
    };
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.drawChart();
  }

  handleResize(WindowSize, event) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - 50,
    });
  }
  componentDidUpdate() {
    this.drawChart();
  }

  getBubbleScale(caps) {
    return scaleLog(caps)
      .domain([min(caps), max(caps)])
      .range([10, 100]);
  }

  tick(node, d) {
    node.attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    });
  }

  onDragStart(simulation, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  onDrag(d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  onDragEnd(simulation, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  drawChart() {
    const { data, onBubbleClick } = this.props;

    const g = select(this.refs.circleContainer);

    const caps = data.map(coin => parseFloat(coin.market_cap_usd));
    const rScale = this.getBubbleScale(caps);

    var simulation = forceSimulation()
      .nodes(data)
      .force('center', forceCenter())
      .force(
        'collide',
        forceCollide(function(d) {
          return rScale(d.market_cap_usd) + 2;
        }).iterations(16)
      )
      .force('gravity', forceManyBody(0))
      .force('x', forceX().strength(0.05))
      .force('y', forceY().strength(0.05))
      .force('tick', d => {
        this.tick(node, d);
      });
    const node = g
      .selectAll('.node')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .attr('cursor', 'pointer')
      .on('click', onBubbleClick)
      .call(
        drag()
          .on('start', d => {
            this.onDragStart(simulation, d);
          })
          .on('drag', this.onDrag)
          .on('end', d => {
            this.onDragEnd(simulation, d);
          })
      );

    const circles = node
      .append('circle')
      .attr('r', d => {
        return rScale(parseFloat(d.market_cap_usd));
      })
      .style('fill', function(d) {
        return parseFloat(d.percent_change_24h) > 0 ? '#07BEB8' : '#25283D';
      });

    node
      .append('text')
      .attr('dy', function(d) {
        return 2;
      })
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-family', 'Arial')
      .style('pointer-events', 'none')
      .style('font-size', d => {
        const r = rScale(parseFloat(d.market_cap_usd));
        return r > 16 ? 10 : 7;
      })
      .text(function(d) {
        return d.symbol;
      });
  }

  render() {
    const { width, height, selectedBubble } = this.state;
    return (
      <div className="chartContainer">
        <svg width={width} height={height} ref="svg">
          <g
            style={{
              transform: `translate(${width / 2}px , ${height / 2}px)`,
            }}
            ref="circleContainer"
          />
        </svg>
        <div />
      </div>
    );
  }
}

BubbleChart.propTypes = {
  data: PropTypes.array.isRequired,
  onBubbleClick: PropTypes.func.isRequired,
};

export default BubbleChart;
