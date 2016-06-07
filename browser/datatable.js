'use strict';

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
        // return row's corresponding value for each header
        return headers.map(function(col){
          return {column: abbreviate(col), value: d[col], url: d.URL}
        });
      })
      .enter().append('td')
      .attr('class', function(d){
        return 'data-cell ' + d.column;
      })
      .text(function(d){
        // insert html for all but 'name'
        if(d.column !== 'name'){
          return d.value;
        }
      });

  // append links for each datum in name column
  var nameCells = d3.selectAll('.name')
      .append('a')
      .html(function(d){
        return d.value ? d.value : extractName(d.url);
      })
      .attr('href', function(d){
        return d.url;
      });
}


// ---------------------
// DATA TABLE HELPERS
// ---------------------

function toggleSelectedTableRows(rows) {
  for (var i = 0, len = rows.length; i < len; i++){
    var row = d3.select('#' + rows[i].id);
    if(row.classed('selected')){
      row.classed({'selected': false});
    } else {
      row.classed({'selected': true});
    }
  }
}

