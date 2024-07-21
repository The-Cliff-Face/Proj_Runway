// components/RadarChart.js
import React from 'react';
import { radar } from 'svg-radar-chart';
import stringify from 'virtual-dom-stringify'


const RadarChart = ({ data, options }) => {

  const truncateTitle = (title) => {
    if (title.length > 10) {
        return title.substring(0, 30) + '...';
    }
    return title;
};


    const chart = radar({
        // columns
        first: truncateTitle(data[0].name) + " : "+ (Math.round(data[0].score*100,2)/100),
        second: truncateTitle(data[1].name) + " : "+ (Math.round(data[1].score*100,2)/100),
        third: truncateTitle(data[2].name) + " : "+ (Math.round(data[2].score*100,2)/100),
    }, [
        // data
        {class: 'user', first: data[0].score,  second: data[1].score, third:  data[2].score},
    ]);

    const svg = `
<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 120 120"> 
  <style>
    text { /* Add styles for text */
      fill: white; /* Set text color to white */
    }

    .axis {
      stroke-width: .2;
      stroke: white; /* Add color to axis */
    }
    .scale {
      stroke-width: .2;
      stroke: gray; /* Add color to scale */
    }
    .shape {
      fill: #c790e0; /* Add fill color to shapes */
      fill-opacity: .3;
    }
    .shape:hover {
      fill-opacity: .6;
    }
  </style>
  ${stringify(chart)}
</svg>`

    return (
        <>
          
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />
        </>
    );

};

export default RadarChart;
