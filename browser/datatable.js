app.factory('TableFactory', function(){
  var TableFactory = {};

  // ---------------------
  // DATA TABLE HELPERS
  // ---------------------
 var headers = ['Name/Alias', 'Gender', 'Year', 'Notes'];
  function getValueByColumn(d){
    // return row's corresponding value for each header
    return headers.map(function(col){
      return {column: headerToClassName(col), value: d[col], url: d.URL}
    });
  }


  // -------------------
  // STRING MANIPULATION
  // -------------------

  function headerToClassName(str){
    return str.split('/')[0].toLowerCase();
  }

  function parseName(url){
    var urlArr = url.split('/')
    var name = urlArr[urlArr.length-1];

    // find the first non-word character and trim away following chars
    var firstSymb = name.search(/\W/i);
    return name.slice(0, firstSymb).replace(/[^a-z]/ig, ' ').replace(/$\s/,'');
  }

  // ---------------------
  // DATA TABLE EXPORTS
  // ---------------------
  TableFactory.headers = headers;

  TableFactory.toggleSelectedTableRows = function(rows) {
    console.log('triggered')
    for (var i = 0, len = rows.length; i < len; i++){
      var row = d3.select('#' + rows[i].id);
      if(row.classed('selected')){
        row.classed({'selected': false});
      } else {
        row.classed({'selected': true});
      }
    }
  };

  // ---------------------
  // DRAW DATA TABLE
  // ---------------------
  TableFactory.createDataTable = function (rows, tableBody){

    // add row to table for each row of data returned
    var row = tableBody.selectAll('.data-row')
        .data(rows)
        .enter().append('tr')
        .attr('id', function(d){
          return d['id'];
        });

    // insert data for each row
    var cell = row.selectAll('td')
        .data(getValueByColumn) // returns object with column classname and datavalue
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
          return d.value ? d.value : parseName(d.url);
        })
        .attr('href', function(d){
          return d.url;
        });
  };

  return TableFactory;
});
