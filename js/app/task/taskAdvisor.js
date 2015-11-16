/**
 * @file
 * task advisor module for the task Creator.
 */
define(['jquery', 'task/checks/first', 'task/checks/emptyTimes', 'task/checks/unique', 'task/checks/last',  'jgrowl'],
function($, firstIsTakeoff, emptyTimes, unique, lastIsGoal) {
  var turnpointTests = Array(firstIsTakeoff, emptyTimes, unique);
  var taskTests = Array(firstIsTakeoff, emptyTimes, unique, lastIsGoal);

  var turnpointCheck = function(turnpoint, turnpoints) {
    for (var i = 0; i < turnpointTests.length; i++) {
      var test = turnpointTests[i].run(turnpoint, turnpoints);
      
      if (test.advice == true) {
        $.jGrowl(test.message, {
          header : test.status,
          theme : test.status,
          sticky : true,
          position : 'top-left',
        });
      }
    }
  }

  var taskCheck = function(turnpoints, taskInfo) {

  }

  return {
    turnpointCheck: turnpointCheck,
    taskCheck : taskCheck,
  }

});
