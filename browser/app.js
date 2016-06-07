// var data = [4, 8, 15, 16, 23, 0, 42];

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
        .range([0, width]);

// set width attribute of entire svg element
var chart = d3.select('.bar-chart')
            .attr('width', width)

d3.csv('avengers-txt.csv', type, function(err, data){
  x.domain([0, d3.max(data, function(d){ return d.Appearances })]);
  chart.attr('height', barHeight * data.length);

  // create g element for each datum
  var bar = chart.selectAll('g')
          .data(data)
          .enter().append('g')
          .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'}); //horizontal, vertical translation

  bar.append('rect')
    .attr('width', function(d){return x(d.Appearances)})
    .attr('height', barHeight - 1); // -1 gives space between bars vertically

  bar.append('text')
    .attr('x', function(d){ return x(d.Appearances) - 3;}) // x relative to parent element
    .attr('y', barHeight/2)
    .attr('dy', '.35em')
    .text(function (d) { return d['Name/Alias'] + ' ' + d.Appearances });
});

function type(d) {
  d.Appearances = +d.Appearances;
  return d;
}