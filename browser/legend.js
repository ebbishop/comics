
app.factory('LegendFactory', function(UtilsFactory){
  var LegendFactory = {};

  // -----------------
  // LEGEND SETUP
  // -----------------

  var lMargin = {top: 10, right: 10, bottom: 10, left: 30};
  var lPadding = {top: 5, right: 10, bottom: 10, left: 10};

  var lHeight = 100 - lMargin.top - lMargin.bottom;
  var lWidth = 150 - lMargin.left - lMargin.right;

  var legendScale = d3.scale.ordinal()
      .rangeRoundBands([0, lHeight - 10], 0.2);


  // -----------------
  // LEGEND EXPORTS
  // -----------------

  LegendFactory.lMargin =lMargin;
  LegendFactory.lPadding = lPadding;

  LegendFactory.lHeight =lHeight;
  LegendFactory.lWidth = lWidth;

  // -----------------
  // DRAW LEGEND
  // -----------------
  LegendFactory.createLegend = function(rows, legend){
    var legendSeriesData = UtilsFactory.getList(rows, 'Gender')
      .sort(function(p,c){
        return p < c ? -1 : 1;
      });
    legendScale.domain(legendSeriesData);

    var legendSeries = legend.selectAll('.legend-series')
      .data(legendSeriesData)
      .enter()
      .append('g')
      .attr('class', function(d) { return d; })
      .attr('height', 20)
      .attr('width', lWidth)
      .attr('transform', function(d){
        return 'translate(' + lPadding.left + ', ' + (legendScale(d) + lPadding.top + 10)+ ')';
      });

    legendSeries.append('rect')
      .attr('height', function(d) {
        return legendScale.rangeBand() < 20 ? legendScale.rangeBand() : 20;
      })
      .attr('width', 20)
      .attr('transform', function(){
        var myHeight = legendScale.rangeBand() < 20 ? legendScale.rangeBand() : 20
        return 'translate(0,' + -(legendScale.rangeBand() - myHeight)/2 + ')';
      })
    legendSeries.append('text')
      .text( function(d){return d;})
      .attr('x', 20 + lPadding.left)
      .attr('y', (legendScale.rangeBand() - 10)/2 );
  }

  return LegendFactory;
});
