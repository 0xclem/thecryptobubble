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

const WIDTH = 1200;
const HEIGHT = 768;

class BubbleChart extends Component {
  constructor() {
    super();
    this.state = {
      selectedBubble: null,
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    //Dirty hack. We basically blank the chart's nodes.
    //A best way do it: Use D3 Enter, Update and Exit.
    //Easy with a flat structure but harder with g wrappers for circle and text elements.
    const targetEl = this.refs.circleContainer;
    while (targetEl.firstChild) targetEl.removeChild(targetEl.firstChild);
    this.drawChart();
  }

  getBubbleScale(caps) {
    return scaleLog(caps)
      .domain([min(caps), max(caps)])
      .range([10, 90]);
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
        this.tick(nodes, d);
      });

    const nodes = g
      .selectAll('.node')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
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

    nodes
      .append('circle')
      .attr('r', d => {
        return rScale(parseFloat(d.market_cap_usd));
      })
      .style('fill', function(d) {
        return parseFloat(d.percent_change_24h) > 0 ? '#07BEB8' : '#25283D';
      });

    nodes
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
      <div>
        <svg width={WIDTH} height={HEIGHT} ref="svg">
          <g
            style={{
              transform: `translate(${WIDTH / 2}px , ${HEIGHT / 2}px)`,
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
