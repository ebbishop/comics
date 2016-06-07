'use strict';

// --------------------
// DRAW BAR CHART
// --------------------

function createBarChart(rows){
  // group data by year
  var groupedByYear = d3.nest()
        .key(function(d) {
          return d.Year;
        })
        .sortKeys(d3.ascending)
        .entries(rows);

  var parsedData = parseGenderData(groupedByYear);


  // set scale for x-axis
   x.domain(parsedData.map(function(d){
      return d.year;
    }));

  var barWidth = x.rangeBand()/2;
  console.log('barWidth', barWidth)

  // get maximum count for any gender, in any year
  var maxCt = d3.max(parsedData, getMaxPerYear);

  // set scale for y-axis
  y.domain([maxCt, 0]);

  // x-axis generator
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  // y-axis generator
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

  // append x-axis
  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

  chart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);


  var year = chart.selectAll('.year')
      .data(parsedData)
      .enter()
      .append('g')
      .attr('class', 'year')
      .attr('transform', function(d, i){
        return 'translate(' + (i * barWidth * 2 ) + ', 0)';
      })
      .attr('height', height)
      .attr('width', barWidth * 2);

      // add bars to years
    year.selectAll('.bar')
      .data(function(d, i) {
        return d.data;
      })
      .enter()
      .append('rect')
      .attr('class', function(d){
        return 'bar ' + d.gender;
      })
      .attr('width', barWidth - 1)
      .attr('height', function(d) {
        return height - y(d.values.length);
      })
      .attr('transform', getTransformation)
      .on('click', toggleSelectedBar);
}

// -----------------
// BAR CHART HELPERS
// -----------------

function getMaxPerYear(year) {
  return d3.max(year.data, function(d){
    return d.values.length;
  });
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
  console.log(x.rangeBand()/2, i);
  var horizontal = x.rangeBand()/4 - 1.5;
  if (d.gender === 'male') {
    horizontal += (x.rangeBand()/2) - 1;
  }
  return 'translate(' + horizontal + ', ' + (height - (height - y(d.values.length)) -.5 )+ ')';
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
