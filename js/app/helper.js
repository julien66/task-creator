/**
 * @file
 * Helper module for the task creator.
 */
 define([], function() {
   var formatOptions = function(values, defaultValue) {
     var options = '';
     for (var i = 0; i < values.length; i++) {
       if (values[i] == defaultValue) {
         options += '<option value="' + values[i] + '" selected="true">' + cleanValue(values[i])+ '</option>';
       }
       else {
         options += '<option value="' + values[i] + '">' + cleanValue(values[i]) + '</option>';
       }
     }
     return options;
   }
   
  function cleanValue(value) {
    return (typeof value == 'string') ? value.replace(/-/g,' ') : value;
  }
  
  function randomColor(hashtag) {
    var letters = '0123456789ABCDEF'.split('');
    var color = hashtag ? '#' : '';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return {
     formatOptions: formatOptions,
     randomColor : randomColor,
  }
 });
