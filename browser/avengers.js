var margin = {top: 20, right: 30, bottom: 30, left: 20};

// set width & height of chart
var height = 500 - margin.top - margin.bottom;
var width = 1050 - margin.left - margin.right;

var barWidth = 20;

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


// get data
d3.csv('avengers-txt.csv', function(err, rows){
  // group data by year and gender
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
      .attr('width', barWidth);

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
      .attr('width', barWidth -1)
      .attr('height', function(d) {
        return height - y(d.values.length);
      })
      .attr('transform', getTransformation);


});

function getMaxPerYear(year) {
  return d3.max(year.data, function(d){
    return d.values.length;
  });
}

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

function getTransformation (d) {
  var horizontal = 0;
  if (d.gender === 'male') {
    horizontal += barWidth - 1;
  }
  return 'translate(' + horizontal + ', ' + (height - (height - y(d.values.length)) )+ ')';
}