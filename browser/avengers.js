'use strict';

// --------------------
// SET UP FOR BAR CHART
// --------------------

  var margin = {top: 20, right: 30, bottom: 30, left: 30};

  // set width & height of chart
  var height = 500 - margin.top - margin.bottom;
  var width = 1150 - margin.left - margin.right;


  // scale for x-axis
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width]);

  // scale for y-axis
  var y = d3.scale.linear()
      .range([0, height]);


  // select chart element, set width, height & margins
  var chart = d3.select('.bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// ---------------------
// SET UP FOR DATA TABLE
// ---------------------

  var headers = ['Name/Alias', 'Gender', 'Year', 'Notes'];

  // initialize table with headers
  var table = d3.select('table');

  table.append('thead')
    .selectAll('th')
    .data(headers)
    .enter().append('th')
    .html(function(d){
      return d;
    });

  var tableBody = table.append('tbody');





// --------
// GET DATA
// --------

d3.csv('avengers-txt.csv', function(err, rows){
  // add id field to each row
  rows.forEach(function(r, i){
    r['id'] = 'a' + padString(i, 3, '0');
  });

  // fill in bar-chart
  createBarChart(rows);

  // fill in data-table
  createDataTable(rows);

});


// -------------------
// STRING MANIPULATION
// -------------------

function padString(str, max, padWith){
  str = str.toString();
  while(str.length < max){
    str = padWith + str.toString();
  }
  return str;
}

function abbreviate(str){
  return str.split('/')[0].toLowerCase();
}

function extractName(url){
  var name = url.split('/')[url.split('/').length-1];
  // find the first non-word character and trim away following
  var firstIdx = name.search(/\W/i);
  return name.slice(0, firstIdx).replace(/[^a-z]/ig, ' ').replace(/$\s/,'');
}
