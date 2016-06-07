var headers = ['Name/Alias', 'Gender', 'Year', 'Notes'];
var headerClasses = {'Name/Alias': 'name', 'Gender': 'gender', 'Year': 'year', 'Notes': 'notes'};

// initialize table with headers
var table = d3.select('table')


  table.append('thead')
    .selectAll('th')
    .data(headers)
    .enter().append('th')
    .html(function(d){
      return d
    });

  var tableBody = table.append('tbody');


d3.csv('avengers-txt.csv', function(err, rows){

  // add row to table for each row of data returned
  var row = tableBody.selectAll('.data-row')
      .data(rows)
      .enter().append('tr')
      .attr('id', function(d){
        return d['Name/Alias'];
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

});

