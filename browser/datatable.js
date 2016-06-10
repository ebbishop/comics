app.factory('TableFactory', function(){
  var TableFactory = {};

  TableFactory.headers = ['Name/Alias', 'Gender', 'Year', 'Notes'];

  TableFactory.toggleSelectedTableRows = function(rows) {

    for (var i = 0, len = rows.length; i < len; i++){
      var row = angular.element(document.querySelector('#'+rows[i].id));
      if(row.hasClass('selected')){
        row.removeClass('selected');
      } else {
        row.addClass('selected');
      }
    }
  };

  return TableFactory;
});
