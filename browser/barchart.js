app.factory('BarChartFactory', function(TableFactory, UtilsFactory){
  var BarChartFactory = {};

  // -----------------
  // BAR CHART SETUP
  // -----------------

  // set width & height of chart
  var margin = {top: 20, right: 30, bottom: 30, left: 30};
  var height = 500 - margin.top - margin.bottom;
  var width = 1150 - margin.left - margin.right;

  // pixel scale for x-axis
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

  // pixel scale for y-axis
  var y = d3.scale.linear()
      .range([0, height]);


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
    TableFactory.toggleSelectedTableRows(data.data);
  }


  function parseDataByGender(rows) {
    var genders = UtilsFactory.getList(rows, 'Gender');
    var years = UtilsFactory.getList(rows, 'Year');

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


  function getDataForKeyByValue(data, key, value) {
    var filteredData = {};
    filteredData[key.toLowerCase()] = value
    filteredData['data'] = data.filter(function(d){
      return d[key] === value;
    });
    return filteredData;
  }



  // -----------------
  // BAR CHART EXPORTS
  // -----------------
  BarChartFactory.margin = margin;
  BarChartFactory.height = height;
  BarChartFactory.width = width;

  // -----------------
  // DRAW BAR CHART
  // -----------------
  BarChartFactory.createBarChart = function(rows, chart){

    // group data by year
    var parsedData = parseDataByGender(rows);

    // set ordinals for x-axis
     x.domain(UtilsFactory.getList(rows, 'Year'));

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

  return BarChartFactory;
});
