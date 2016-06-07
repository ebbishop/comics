var height = 500,
    barWidth = 20;

var y = d3.scale.linear()
        .range([0, height]);

// set height attribute of entire svg element
var chart = d3.select('.bar-chart')
            .attr('height', height);

d3.csv('avengers-txt.csv', type, function(err, dataRows){

  y.domain([0, d3.max(dataRows, function(d){ return d.Appearances; })]);

  // width of svg based on size of dataset
  chart.attr('width', barWidth * dataRows.length);

  // create g element for each datum
  var bar = chart.selectAll('g')
          .data(dataRows)
          .enter().append('g')
          .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ', ' + (height - y(d.Appearances)) + ')'; }); //horizontal, vertical translation

  bar.append('rect')
    .attr('height', function(d){return y(d.Appearances); })
    .attr('width', barWidth - 1); // -1 gives space between bars vertically

  bar.append('text')
    .text(function (d) { return d.Appearances; })
    .attr('transform', function(d, i) { return 'translate(' + barWidth/4 + ',' + 3 + ')rotate(-90)'; })
    .attr('dy', '.75em');
});

function type(d) {
  d.Appearances = +d.Appearances;
  return d;
}
