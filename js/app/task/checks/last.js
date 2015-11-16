/**
 * @file
 * first turnpoint check for the task creator
 */
define([], function() {
  var run = function(turnpoint, turnpoints) {
    if (turnpoint.index == turnpoints.length - 1 && turnpoint.type != 'goal') {
      return {
        advice : true,
        status : 'warning',
        message : 'Last turnpoint should be a goal.',
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
