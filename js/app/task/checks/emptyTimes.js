/**
 * @file
 * first turnpoint check for the task creator
 */
define([], function() {
  var run = function(turnpoint, turnpoints) {
    var advice = false;
    var message = '';
    var status = '';
    
    if (turnpoint.type == 'takeoff' && (turnpoint.open == 0 || turnpoint.close == 0)) {
      advice = true;
      status = 'warning';
      message = 'You should set the window opening AND closing times for the takeoff.';
    }
    else if (turnpoint.type == 'start' && turnpoint.open == 0) {
      advice = true;
      status = 'warning';
      message = 'You should set the start opening time.';
    }
    else if (turnpoint.type == 'goal' && turnpoint.close == 0) {
      advice = true;
      status = 'warning';
      message = 'You should set the goal closing time.';
    }

    return {
      advice : advice,
      status : status,
      message : message,
    }
  }

  return {
    run: run,
  }
});
