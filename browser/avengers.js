var app = angular.module('myApp', []);

app.controller('MainCtrl', function($scope, $window, UtilsFactory) {

  d3.csv('avengers-txt.csv', function(err, rows){

    // add id field and active field to each row
    $scope.$apply(function(){
      rows.forEach(function(r, i){
        r['id'] = 'a' + UtilsFactory.padString(i, 3, '0');
        r['active'] = false;
      });
      $scope.avengerData = rows;
    });
  });


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

    // watch scope for data in rows
    scope.$watch('rows', update, true);

    function update(newVal, oldVal){
      if(!scope.rows) return;
      var rows = scope.rows;
      BarChartFactory.createBarChart(rows, chart);
      LegendFactory.createLegend(rows, legend);
    }

  }

  return {
    restrict: 'E',
    link: link,
    scope: {
      rows: '='
    }
  }
});

// ---------------------
// DATA TABLE DIRECTIVE
// ---------------------
app.directive('avengerTable', function(TableFactory){
  function link(scope, el, attrs){
    scope.headers = TableFactory.headers;

    scope.$watch('rows', update, true);

    function update(newVal, oldVal){
      if(!scope.rows) return;
      var rows = scope.rows;
    }
  }
  return {
    templateUrl: 'html/avengertable.html',
    restrict: 'E',
    scope: {
      rows: '='
    },
    link: link
  }
});


// ----------
// FILTERS
// ----------
app.filter('headerToClass', function(){
  return function(str){
    return str.split('/')[0].toLowerCase();
  };
});

app.filter('parseName', function(){
  return function(url){
    var urlArr = url.split('/')
    var name = urlArr[urlArr.length-1];

    // find the first non-word character and trim away following chars
    var firstSymb = name.search(/\W/i);
    return name.slice(0, firstSymb).replace(/[^a-z]/ig, ' ').replace(/$\s/,'');
  };

});