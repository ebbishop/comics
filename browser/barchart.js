'use strict';

// --------------------
// SET UP FOR BAR CHART
// --------------------

  var margin = {top: 20, right: 30, bottom: 30, left: 30};

  // set width & height of chart
  var height = 500 - margin.top - margin.bottom;
  var width = 1150 - margin.left - margin.right;


  // pixel scale for x-axis
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

  // pixel scale for y-axis
  var y = d3.scale.linear()
      .range([0, height]);

  // select chart element, set width, height & margins
  var chart = d3.select('.bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// --------------------
// DRAW BAR CHART
// --------------------

function createBarChart(rows){
  // group data by year
  var groupedByYear = groupByYear(rows);
  var parsedData = parseGenderData(groupedByYear);


  // set ordinals for x-axis
   x.domain(parsedData.map(function(d){
      return d.year;
    }));

  var barWidth = x.rangeBand()/2;

  // get maximum count for any gender, in any year
  var maxCt = d3.max(parsedData, getMaxPerYear);

  // set value scale for y-axis
  y.domain([maxCt, 0]);


  // append y-axis
  chart.append('g')
    .attr('class', 'y axis')
    .call(makeYAxis());

  // append y-axis gridlines
  chart.append('g')
    .attr('class', 'grid')
    .call(makeYAxis()
      .tickSize(-width, 0, 0)
      .tickFormat(''))
    .attr('transform', 'translate(.5, 0)');

  // append x-axis
  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(makeXAxis());


  // insert groups for each year's data
  var year = chart.selectAll('.year')
      .data(parsedData)
      .enter()
      .append('g')
      .attr('class', 'year')
      .attr('transform', function(d, i){
        return 'translate(' + (x(d.year) ) + ', 0)';
      })
      .attr('height', height)
      .attr('width', barWidth * 2);

    // add two bars to each year's group
    year.selectAll('.bar')
      .data(function(d, i) {
        return d.data;
      })
      .enter()
      .append('rect')
      .attr('class', function(d){
        return 'bar ' + d.gender;
      })
      .attr('width', barWidth)
      .attr('height', function(d) {
        return height - y(d.values.length);
      })
      .attr('transform', getTransformation)
      .on('click', toggleSelectedBar);
}




// -----------------
// BAR CHART HELPERS
// -----------------

function makeXAxis() {
  return d3.svg.axis()
    .scale(x)
    .orient('bottom');
}

function makeYAxis(){
  return d3.svg.axis()
    .scale(y)
    .orient('left');
}

function getMaxPerYear(year) {
  return d3.max(year.data, function(d){
    return d.values.length;
  });
}
function groupByYear(rows) {
  return d3.nest()
    .key(function(d) {
      return d.Year;
    })
    .sortKeys(d3.ascending)
    .entries(rows);
}
// re-format data nesting for better access to data counts & details
function parseGenderData(rows) {
  var data = [], temp;

  for (var i = 0, len = rows.length; i < len; i ++){
    temp = {};
    temp.year = rows[i].key;
    temp.data = [
      {
        gender: 'female',
        values: rows[i].values.filter(function(a){
          return a.Gender === 'FEMALE';
        })
      },
      {
        gender: 'male',
        values: rows[i].values.filter(function (a) {
          return a.Gender === 'MALE';
        })
      }
    ];
    data.push(temp);
  }

  return data;
}

function getTransformation(d, i) {
  var horizontal = 0;
  if (d.gender === 'male') {
    horizontal += x.rangeBand()/2;
  }
  return 'translate(' + horizontal + ', ' + (height - (height - y(d.values.length)) - .5)+ ')';
}


function toggleSelectedBar(data){
  var el = d3.select(this);
  if(el.classed('selected')){
    el.classed({'selected': false});
  } else {
    el.classed({'selected': true});
  }
  toggleSelectedTableRows(data.values);
}
