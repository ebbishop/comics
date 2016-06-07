var height = 500;
var barWidth = 20;

var y = d3.scale.linear().range([0, height]);

var chart = d3.select('.bar-chart')
              .attr('height', height);

d3.csv('avengers-txt.csv', function (err, rows) {

  // group data by year and gender
  var nestedData = d3.nest()
      .key(function(d) { return d.Year; })
      .sortKeys(d3.ascending)
      .rollup(function(d){
        return {
          maleCt: d.filter(function(r){
            return r.Gender === 'MALE';
          }).length,
          femaleCt: d.filter(function(r){
            return r.Gender === 'FEMALE';
          }).length
        };
      })
      .entries(rows);

      console.log(nestedData);

  // get maximum count per gender per year
  var maxCt = d3.max(nestedData, function(y){
    return y.values.maleCt > y.values.femaleCt ? y.values.maleCt : y.values.femaleCt;
  });

  // scale to use for y-axis
  y.domain([0, maxCt]);

  // width of svg, based on size of dataset
  chart.attr('width', barWidth * 2 * nestedData.length);

  var year = chart.selectAll('g')
            .data(nestedData)
            .enter().append('g')
            .attr('transform', function(d, i){
              return 'translate(' + i * barWidth * 2 + ', 0)';
            })
            .attr('height', height);

  // append female data
  year.append('rect')
      .attr('height', function(d){
        return y(d.values.femaleCt);
      })
      .attr('width', barWidth - 1)
      .attr('class', 'female')
      .attr('transform', function(d, i) {
        return 'translate(0, ' + (height - y(d.values.femaleCt)) + ')';
      });

  // append male
  year.append('rect')
      .attr('height', function(d){
        return y(d.values.maleCt);
      })
      .attr('width', barWidth - 1)
      .attr('class', 'male')
      .attr('transform', function(d, i){
        return 'translate(' + (barWidth - 1) + ', ' + (height - y(d.values.maleCt)) + ')';
      });


});
