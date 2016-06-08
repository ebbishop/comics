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

  // append background image
  chart.append('png:image')
    .attr('xlink:href', 'avengers.png')
    .attr('height', height)
    .attr('width', width);


// --------------------
// DRAW BAR CHART
// --------------------

function createBarChart(rows){

  // group data by year
  var parsedData = parseDataByGender(rows);


  // set ordinals for x-axis
   x.domain(getList(rows, 'Year'));

  var barWidth = x.rangeBand()/2;

  // get maximum count for any gender, in any year
  var maxCt = d3.max(parsedData, getMaxPerGroup)

  // set value scale for y-axis
  y.domain([maxCt, 0]);


  // draw y-axis
  chart.append('g')
    .attr('class', 'y axis')
    .call(makeYAxis());

  // draw y-axis gridlines
  chart.append('g')
    .attr('class', 'grid')
    .call(makeYAxis()
      .tickSize(-width, 0, 0)
      .tickFormat(''))
    .attr('transform', 'translate(.5, 0)');

  // draw x-axis
  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(makeXAxis());

  // draw each data series
  var series = chart.selectAll('.series')
    .data(parsedData)
    .enter()
    .append('g')
    .attr('height', height)
    .attr('width', width)
    .attr('class', function(d){
      return d.gender;
    })
    .attr('transform', function(d){
      if(d.gender === 'MALE'){
        return 'translate(' + barWidth + ',0)';
      }
    });

  series.selectAll('.bar')
    .data(function(d, i){
      return d.data;
    })
    .enter()
    .append('rect')
    .attr('class', function(d){
      return d.year;
    })
    .attr('width', barWidth)
    .attr('height', function(d){
      return height - y(d.data.length);
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

function getMaxPerGroup(group) {
  return d3.max(group.data, function(d){
    return d.data.length;
  });
}

function getTransformation(d, i) {
  // debugger;
  var horizontal = x(d.year);
  var vertical = (height - (height - y(d.data.length)));
  return 'translate(' + horizontal + ', ' + vertical + ')';
}


function toggleSelectedBar(data){
  var el = d3.select(this);
  if(el.classed('selected')){
    el.classed({'selected': false});
  } else {
    el.classed({'selected': true});
  }
  toggleSelectedTableRows(data.data);
}


function parseDataByGender(rows) {
  var genders = getList(rows, 'Gender');
  var years = getList(rows, 'Year');

  var dataByGender = [];

  // group all data rows by gender
  genders.forEach(function(g){
    dataByGender.push(getDataForKeyByValue(rows, 'Gender', g));
  });

  // group data rows for each gender by year
  dataByGender.map(function(g){
    var data = [];
    years.forEach(function(y){
      data.push(getDataForKeyByValue(g.data, 'Year', y));
    });
    g.data = data;
  });

  return dataByGender;
}

function getList(rows, key) {
  var items = [];
  for (var i = 0, len = rows.length; i < len; i ++){
    if(items.indexOf(rows[i][key]) < 0){
      items.push(rows[i][key]);
    }
  }
  return items;
}

function getDataForKeyByValue(data, key, value) {
  var filteredData = {};
  filteredData[key.toLowerCase()] = value
  filteredData['data'] = data.filter(function(d){
    return d[key] === value;
  });
  return filteredData;
}
