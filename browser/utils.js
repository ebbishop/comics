app.factory('UtilsFactory', function(){
  var UtilsFactory = {};
  UtilsFactory.getList = function(rows, key) {
    var items = [];
    for (var i = 0, len = rows.length; i < len; i ++){
      if(items.indexOf(rows[i][key]) < 0){
        items.push(rows[i][key]);
      }
    }
    return items;
  };

  return UtilsFactory;

});
