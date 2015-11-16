/**
 * @file
 * first turnpoint check for the task creator
 */
define([], function() {
  var run = function(turnpoint, turnpoints) {
    if (turnpoint.type != 'turnpoint') {
      for (var i = 0; i < turnpoints.length; i++) {
        if (turnpoint.index != turnpoints[i].index && turnpoints[i].type == turnpoint.type) {
          return {
            advice : true,
            status : 'warning',
            message : 'You should have only one ' + turnpoint.type,
          }
        } 
      }
    }
    return {
      advice : false,
    }
  }

  return {
    run: run,
  }
});
