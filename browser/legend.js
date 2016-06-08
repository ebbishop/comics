  var lMargin = {top: 10, right: 10, bottom: 10, left: 30};
  var lPadding = {top: 5, right: 10, bottom: 10, left: 10};

  var lHeight = 100 - lMargin.top - lMargin.bottom;
  var lWidth = 150 - lMargin.left - lMargin.right;

  var legend = chart.append('g')
      .attr('class', 'legend')
      .attr('width', lWidth + lMargin.left + lMargin.right)
      .attr('height', lHeight + lMargin.top + lMargin.bottom)
    .append('g')
      .attr('transform', 'translate(' + lMargin.left + ',' + lMargin.top + ')');


var legendScale = d3.scale.ordinal()
    .rangeRoundBands([0, lHeight - 10], 0.2);

  legend.append('rect')
    .attr('width', lWidth)
    .attr('height', lHeight)
    .attr('class', 'container');
  legend.append('text')
    .text('LEGEND')
    .attr('x', lPadding.left)
    .attr('y', lPadding.top)
    .attr('alignment-baseline', 'text-before-edge');

function createLegend(rows){
  var legendSeriesData = getList(rows, 'Gender');
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