// --------------------
// SET UP FOR BAR CHART
// --------------------

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
      .attr('transform', getTransformation)
      .on('click', toggleSelectedBar);
}

// ---------------------
// SET UP FOR DATA TABLE
// ---------------------

  var headers = ['Name/Alias', 'Gender', 'Year', 'Notes'];
  var headerClasses = {'Name/Alias': 'name', 'Gender': 'gender', 'Year': 'year', 'Notes': 'notes'};

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

// ---------------------
// DRAW DATA TABLE
// ---------------------

function createDataTable(rows){

  // add row to table for each row of data returned
  var row = tableBody.selectAll('.data-row')
      .data(rows)
      .enter().append('tr')
      .attr('id', function(d){
        return d['id'];
      });

  // insert data for each row
  var cell = row.selectAll('td')
      .data(function(d){
        return headers.map(function(col){
          return {column: headerClasses[col], value: d[col], url: d.URL}
        });
      })
      .enter().append('td')
      .attr('class', function(d){
        return 'data-cell ' + d.column;
      })
      .text(function(d){
        if(d.column !== 'name'){
          return d.value;
        }
      });

  // append links for each datum in name column
  var nameCells = d3.selectAll('.name')
      .append('a')
      .html(function(d){
        return d.value;
      })
      .attr('href', function(d){
        return d.url;
      });
}


// --------
// GET DATA
// --------

d3.csv('avengers-txt.csv', function(err, rows){
  rows.forEach(function(r, i){
    r['id'] = 'a' + padString(i, 3, '0');
  });
  console.log(rows);
  createBarChart(rows);
  // addRectEvListeners();
  createDataTable(rows);

});


// -----------------
// BAR CHART HELPERS
// -----------------

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


function toggleSelectedBar(data){
  console.log('data', data);
  var el = d3.select(this);
  if(el.classed('selected')){
    el.classed({'selected': false});
  } else {
    el.classed({'selected': true});
  }
  toggleSelectedTableRows(data.values);
}

function toggleSelectedTableRows(rows) {
  console.log(rows);
  for (var i = 0, len = rows.length; i < len; i++){
    var row = d3.select('#' + rows[i].id);
    console.log('row id: #' + rows[i].id);
    console.log('row', row);
    if(row.classed('selected')){
      row.classed({'selected': false});
    } else {
      row.classed({'selected': true});
    }
  }
}


// -------------------
// STRING MANIPULATION
// -------------------

function convertCharacters(name){
  console.log(name, name.replace(/\W/g, ''));
  return name.replace(/\W/g, '');
}
 function padString(str, max, padWith){
  str = str.toString();
  while(str.length < max){
    // debugger;
    str = padWith + str.toString();
  }
  return str;
 }