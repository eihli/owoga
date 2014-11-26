module.exports = function(){
  var __ = {};

  // Clear require.cache for testing/debugging purposes.
  __.clrCache = function(){
    for (var key in require.cache)
      delete require.cache[key];
  }

  // String helpers
  __.reverseString = function(string){
    var i = string.length - 1,
        resultString = '';
    while (i >=0){
      resultString = resultString + string[i]
      i--;
    }
    return resultString;
  };

  __.snakeCase = function(string){
    var x = string.length;
    for (i = 0; i < x; i++){
      if (i % 2 == 0)
        string = string.slice(0, i) + string[i].toUpperCase() + string.slice(i+1);
      else
        string = string.slice(0, i) + string[i].toLowerCase() + string.slice(i+1);
    }
    return string
  }

  // Array functions
  __.first = function(array, n){
    if (n == null)
      n = 1;
    return array.slice(0, n);
  }

  __.map = function(array, func){
    var x = array.length, i = 0, resultArray = [];
    for (i; i < x; i++){
      resultArray.push(func(array[i]));
    }
    return resultArray;
  }

  return __;
}()
