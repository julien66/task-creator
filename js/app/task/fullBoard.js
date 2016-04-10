/**
 * @file
 * Full Board Module for the task Creator.
 */
define(['jquery', 'app/helper', 'app/param', 'rejs!task/templates/fullboardTurnpoint', 'rejs!task/templates/fullboard'],
function($, helper, param, turnpointTemplate, fullTemplate) {
  var content = fullTemplate({});
  $('body').append(content);

  var link = $("#full-board");
 
  link.click(function(e) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('openTaskFullBoard', false, false, {});
    document.dispatchEvent(e);
  });

  var toggleLink = function(bool) {
    (bool == true) ? link.css('visibility', 'visible') : link.css('visibility', 'hidden');
  }

  var open = function(task) {
    var content = build(task);
     
  }
  
  $(document).on('click', '#edit-task', function(e) {
    var form = collectForm();
    var e = document.createEvent("customEvent");
    e.initCustomEvent('editTask', false, false, {
      newTask : form,
    });
    document.dispatchEvent(e);
  });
  
  $(document).on('click', '#delete-task', function(e) {
    var e = document.createEvent("customEvent");
    e.initCustomEvent('deleteTask', false, false, {});
    document.dispatchEvent(e);
  });
 
  $(document).on('click', '#export-task', function(e) {
    var e = document.createEvent("customEvent");
    e.initCustomEvent('exportTask', false, false, {});
    document.dispatchEvent(e);
  });
  
  $(document).on('click', '#task-config .turnpoint', function(e) {
    var index = $(this).attr('index');
    //modalWindows.remove(modalWindow);
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('openMapTurnpointConfig', false, false, {
      index: index,
    }); 
    document.dispatchEvent(e);
  });

  var build = function(task) {
    var turnpoints = task.turnpoints;
    var taskInfo = task.taskInfo;
    var taskType = helper.formatOptions(param.task.allowed.type, taskInfo.type);
    var taskNum = helper.formatOptions(param.task.allowed.num, taskInfo.num);
    var turn = (taskInfo.turn == 'right') ? '&#8635' : '&#8634';
    var times = {
      open : {
        takeoff : 0,
        'end-of-speed-section' : 0,
        goal : 0,
      },
      close : {
        win : 0,
        ess : 0,
        goal : 0,
      }
    }

    var turnpointType = {};
    for (var i = 0; i < param.turnpoint.allowed.type.length; i++) {
      turnpointType[param.turnpoint.allowed.type[i]] = Array();
    }
    for (var i = 0; i < turnpoints.length; i++) {
      turnpointType[turnpoints[i].type].push(turnpointTemplate({turnpoint : turnpoints[i]}));
      var type = turnpoints[i].type; 
      if (type == 'end-of-speed-section' || type == 'goal' || type == 'takeoff' ) {
        times.open[type] = turnpoints[i].open;
        times.close[type] = turnpoints[i].close;
      } 
    }
    
    $("#task-config").modal();
    /*return fullTemplate({
      taskInfo : taskInfo,
      taskNum : taskNum,
      taskType : taskType,
      turn : turn,
      turnpoints : turnpoints,
      turnpointType : turnpointType,
      times : times,
    });*/
  }
  
  function collectForm() {
    return {
      num : $("#fullboard-num-select").val(),
      type : $("#fullboard-type-select").val(),
    }
  }

  return {
    toggleLink : toggleLink,
    open : open,
  }
});

