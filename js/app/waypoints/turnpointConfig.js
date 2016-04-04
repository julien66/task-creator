/**
 * @file
 * Turnpoint Configurator module for the task creator
 */
define(['jquery', 'app/helper', 'app/param', 'app/modalWindows', 'rejs!waypoints/templates/turnpoint'],
function($, helper, param, modalWindows, turnpointTemplate) {
  var waypoint;
  var modalWindow;

  $(document).on('click', '#add-turnpoint', function(e) {
    // Getting Form Value
    var turnpointInfo = collectForm();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('addTurnpoint', false, false, {
      waypoint: waypoint,
      turnpointInfo: turnpointInfo,
    });
    document.dispatchEvent(e);
    modalWindows.remove(modalWindow);
  });
  
  $(document).on('change', '#turnpoint-config select', function(e) {
    var select = $(this).val();
    $(this).parent().attr('class', 'tp-' + select);
    handleFormDependencies(select, false);
  });
  
  var handleFormDependencies = function(select, html) {
    var toShow = param.turnpoint.dependencies.show[select];
    var toHide = param.turnpoint.dependencies.hide[select];
    if (toShow) {
      toggleDependencies(toShow, true, html);
    }
    if (toHide) {
      toggleDependencies(toHide, false, html);
    }
  }

  function toggleDependencies(dependencies, mode, html) {
    for (var i = 0; i < dependencies.length; i++) {
      var dependency = (html == false) ? $("#tp-" + dependencies[i]) : html.find("#tp-" + dependencies[i]);
      (mode == true) ? dependency.show() : dependency.hide();
    }
  }

  $(document).on('click', '#delete-turnpoint', function(e) {
    var index = $('#tp-index').val();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('removeTurnpoint', false, false, {
      index: index,
    });
    document.dispatchEvent(e);
  });
  
  $(document).on('click', '#edit-turnpoint', function(e) {
    var info = collectForm();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('editTurnpoint', false, false, {
      info: info,
    });
    document.dispatchEvent(e);
  });

  var openConfigureWindow = function(info) {
    waypoint = info;
    var content = buildForm('create', info);
    modalWindow = modalWindows.add(content);
  }

  var buildForm = function(mode, info) {
    if (mode == 'create') info = param.turnpoint.default;
    var typeOptions = helper.formatOptions(param.turnpoint.allowed.type, info.type);
    var goalOptions = helper.formatOptions(param.turnpoint.allowed.goalType, info.goalType);
    var modeOptions = helper.formatOptions(param.turnpoint.allowed.mode, info.mode);
    var content = turnpointTemplate({
      info : info,
      typeOptions : typeOptions,
      goalOptions : goalOptions,
      modeOptions : modeOptions,
      mode : mode,
    });
    var modifiedContent = $(content);
    handleFormDependencies(modifiedContent.find("#tp-type select").val(), modifiedContent);
    return modifiedContent.html();
  }

  
  var collectForm = function() {
    return {
      close : $("#tp-close-input").val(),
      goalType : $("#tp-goal-type-select").val(),
      index: $('#tp-index').val(),
      mode : $("#tp-mode-select").val(),
      open : $("#tp-open-input").val(),
      radius : parseInt($("#tp-radius-input").val()),
      type : $("#tp-type-select").val(),
    } 
  }
 
  return {
    buildForm : buildForm,
    openConfigureWindow : openConfigureWindow,
  }
});
