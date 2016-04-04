/**
 * @file
 * Task Module for the task creator.
 */
define(['task/taskBoard', 'task/turnpoint', 'task/fullBoard', 'app/param', 'task/taskOptimiser', 'task/taskAdvisor', 'task/taskExporter'],
function(taskBoard, Turnpoint, fullBoard, param, optimizer, taskAdvisor, taskExporter) {
  var turnpoints = [];
  var taskInfo = param.task.default ;

  var addTurnpoint = function(waypoint, turnpointInfo) {
    var turnpoint = new Turnpoint(waypoint);
    turnpointInfo.index = turnpoints.length;
    turnpoint.setTurnpoint(turnpointInfo);
    turnpoints.push(turnpoint);
    taskAdvisor.turnpointCheck(turnpoint, turnpoints);
    taskChange();
  }

  var editTurnpoint = function(info) {
    turnpoints[info.index].setTurnpoint(info);
    taskAdvisor.turnpointCheck(turnpoints[info.index], turnpoints);
    taskChange();
  }

  var removeTurnpoint = function(index) {
    turnpoints.splice(index, 1);
    reorderTurnpoints();
    taskChange();
  }
  
  var getTurnpoints = function() {
    return turnpoints;
  }

  function taskChange() {
    (turnpoints.length > 0) ? fullBoard.toggleLink(true) : fullBoard.toggleLink(false);
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('taskChange', false, false, {
      turnpoints: turnpoints,
      taskInfo : taskInfo,
    });
    document.dispatchEvent(e);
  }
 
  var onClearWaypointFile = function(e) {
    var filename = e.detail.filename;
    var nb = 0;
    for (var i = 0; i < turnpoints.length; i++) {
      if (turnpoints[i].filename == filename) {
        turnpoints.splice(i, 1);
        i--;
        nb++;
      }
    }
    if (nb > 0) {
      taskChange();
    }
  }

  var onAddTurnpoint = function(e) {
    var waypoint = e.detail.waypoint;
    var turnpointInfo = e.detail.turnpointInfo;
    addTurnpoint(waypoint, turnpointInfo);
  }
  
  var onRemoveTurnpoint = function(e) {
    var index = e.detail.index;
    removeTurnpoint(index);
  }

  var onEditTurnpoint = function(e) {
    var info = e.detail.info;
    editTurnpoint(info);
  }

  var reorderTurnpoints = function() {
    for (var i = 0; i < turnpoints.length; i++) {
      var turnpoint = turnpoints[i];
      turnpoint.index = i;
    }
  }
  
  var onReorderTurnpoint = function(e) {
    var oldIndex = e.detail.oldIndex;
    var index = e.detail.index;
    var turnpoint = turnpoints[oldIndex];
    turnpoints.splice(oldIndex, 1);
    turnpoints.splice(index, 0, turnpoint);
    reorderTurnpoints();
    taskChange();
  }

  var onOpenTaskFullBoard = function(e) {
    fullBoard.open({
      turnpoints : turnpoints,
      taskInfo : taskInfo,
    });
  }

  var onTaskEdit = function(e) {
    var newTask = e.detail.newTask;
    taskInfo.num = newTask.num;
    taskInfo.type = newTask.type
  }

  var onTaskDelete = function(e) {
    turnpoints = [];
    taskInfo = param.task.default;
    taskChange();
  }

  var drawCourse = function(google, map) {
    taskInfo.distance = optimizer.optimize(google, map, turnpoints);
    taskBoard.rebuildTask(turnpoints, taskInfo);
  }

  var onTaskExport = function(e) {
    taskExporter.gpxExport(turnpoints, taskInfo);
  }

  var onNewTask = function(e) {
    var waypoints = e.detail.waypoints;
    var tps = e.detail.task;
    if (waypoints) {
      for (var i = 0; i < waypoints.length; i++) {
        addTurnpoint(waypoints[i], tps[i]);
      }
    }
  }

  //document.addEventListener('filenameRemoved', onTaskDelete);
  document.addEventListener('addTurnpoint', onAddTurnpoint);
  document.addEventListener('editTurnpoint', onEditTurnpoint);
  document.addEventListener('removeTurnpoint', onRemoveTurnpoint);
  document.addEventListener('clearWaypointFile', onClearWaypointFile);
  document.addEventListener('reorderTurnpoint', onReorderTurnpoint);
  document.addEventListener('openTaskFullBoard', onOpenTaskFullBoard);
  document.addEventListener('editTask', onTaskEdit);
  document.addEventListener('deleteTask', onTaskDelete);
  document.addEventListener('exportTask', onTaskExport);
  document.addEventListener('newTask', onNewTask);

  return {
    'addTurnpoint' : addTurnpoint,
    'editTurnpooint' : editTurnpoint,
    'removeTurnpoint' : removeTurnpoint,
    'getTurnpoints' : getTurnpoints,
    'delete' : onTaskDelete,
    'drawCourse' : drawCourse,
  }
});
