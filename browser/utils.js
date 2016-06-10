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

  UtilsFactory.padString = function (str, max, padWith){
    str = str.toString();
    while(str.length < max){
      str = padWith + str.toString();
    }
    return str;
  };


  return UtilsFactory;

});
