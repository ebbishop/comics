var app = angular.module('myApp', []);

app.controller('MainCtrl', function($scope, $window) {

  d3.csv('avengers-txt.csv', function(err, rows){

    // add id field to each row
    $scope.$apply(function(){
      rows.forEach(function(r, i){
        r['id'] = 'a' + padString(i, 3, '0');
      });
      $scope.avengerData = rows;
    });
  });

  function padString(str, max, padWith){
    str = str.toString();
    while(str.length < max){
      str = padWith + str.toString();
    }
    return str;
  }

});

app.directive('barChart', function(BarChartFactory, LegendFactory){

  function link(scope, el, attr){
    el = el[0];

    // -----------------
    // BAR CHART SETUP
    // -----------------

    var margin = BarChartFactory.margin;
    var height = BarChartFactory.height;
    var width = BarChartFactory.width;


    // select directive element, append svg, set width, height & margins
    var chart = d3.select(el).append('svg')
        .attr('class', 'bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // append background image
    chart.append('png:image')
      .attr('xlink:href', 'avengers.png')
      .attr('height', height)
      .attr('width', width);

  // -----------------
  // LEGEND SETUP
  // -----------------

    var lMargin = LegendFactory.lMargin;
    var lPadding = LegendFactory.lPadding;
    var lHeight = LegendFactory.lHeight;
    var lWidth = LegendFactory.lWidth;

    var legend = chart.append('g')
        .attr('class', 'legend')
        .attr('width', lWidth + lMargin.left + lMargin.right)
        .attr('height', lHeight + lMargin.top + lMargin.bottom)
      .append('g')
        .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');

    legend.append('rect')
      .attr('width', lWidth)
      .attr('height', lHeight)
      .attr('class', 'container');
    legend.append('text')
      .text('LEGEND')
      .attr('x', lPadding.left)
      .attr('y', lPadding.top)
      .attr('alignment-baseline', 'text-before-edge');

    scope.$watch('data', update, true);

    function update(newVal, oldVal){
      if(!scope.data) return;
      var data = scope.data;
      BarChartFactory.createBarChart(data, chart);
      LegendFactory.createLegend(data, legend);
    }

  }
  return {
    restrict: 'E',
    link: link,
    scope: {
      data: '='
    }
  }
});

app.directive('avengerTable', function(TableFactory){
  function link(scope, el, attrs){
    // ---------------------
    // SET UP FOR DATA TABLE
    // ---------------------

    var table = d3.select(el[0]).append('table')
        .attr('class', 'data-table');
    var headers = TableFactory.headers;

    // initialize table with headers
    table.append('thead')
      .selectAll('th')
      .data(headers)
      .enter().append('th')
      .html(function(d){
        return d;
      });

    var tableBody = table.append('tbody');


    scope.$watch('data', update, true);

    function update(newVal, oldVal){
      if(!scope.data) return;
      var data = scope.data;
      TableFactory.createDataTable(data, tableBody);
    }
  }
  return {
    restrict: 'E',
    link: link,
    scope: {
      data: '='
    }
  }
})