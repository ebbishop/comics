'use strict';


// --------
// GET DATA
// --------

d3.csv('avengers-txt.csv', function(err, rows){
  // add id field to each row
  rows.forEach(function(r, i){
    r['id'] = 'a' + padString(i, 3, '0');
  });

  // fill in bar-chart
  createBarChart(rows);

  // fill in data-table
  createDataTable(rows);

});


// -------------------
// STRING MANIPULATION
// -------------------

function padString(str, max, padWith){
  str = str.toString();
  while(str.length < max){
    str = padWith + str.toString();
  }
  return str;
}




