/**
 * @file
 * first turnpoint check for the task creator
 */
define([], function() {
  var run = function(turnpoint, turnpoints) {
    if (turnpoint.index == 0 && turnpoint.type != 'takeoff') {
      return {
        advice : true,
        status : 'warning',
        message : 'You should select a takeoff as your first turnpoint.',
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
