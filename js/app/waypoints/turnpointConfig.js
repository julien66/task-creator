/**
 * @file
 * Turnpoint Configurator module for the task creator
 */
define(['jquery', 'bootstrap', 'app/helper', 'app/param', 'rejs!waypoints/templates/turnpoint'],
function($, b, helper, param, turnpointTemplate) {
  var waypoint;
  var content = turnpointTemplate({});
  $("body").append(content);

  $("#turnpoint-config").on('show.bs.modal', function(e) {
    handleFormDependencies($("#tp-type select").val(), $("#turnpoint-config"));
  });

  $(document).on('click', '#add-turnpoint', function(e) {
    // Getting Form Value
    var turnpointInfo = collectForm();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('addTurnpoint', false, false, {
      waypoint: waypoint,
      turnpointInfo: turnpointInfo,
    });
    document.dispatchEvent(e);
    $("#turnpoint-config").modal('hide');
  });
 
  $(document).on('change', '#turnpoint-config select', function(e) {
    var select = $(this).val();
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
    $("#turnpoint-config").modal('hide');
  });
  
  $(document).on('click', '#edit-turnpoint', function(e) {
    var info = collectForm();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('editTurnpoint', false, false, {
      info: info,
    });
    document.dispatchEvent(e);
    $("#turnpoint-config").modal('hide');
  });

  var openConfigureWindow = function(info) {
    waypoint = info;
    buildForm('create', info);
  }

  var buildForm = function(mode, info) {
    var typeOptions = helper.formatOptions(param.turnpoint.allowed.type, info.type);
    var goalOptions = helper.formatOptions(param.turnpoint.allowed.goalType, info.goalType);
    var modeOptions = helper.formatOptions(param.turnpoint.allowed.mode, info.mode);
    $("#tp-type select").html(typeOptions);
    $("#tp-goal-type select").html(goalOptions);
    $("#tp-mode select").html(modeOptions);
    $("#tp-radius input").val(info.radius); 
    $("#tp-open input").val(info.open); 
    $("#tp-close input").val(info.close); 
    $("#tp-index").val(info.index);

    //handleFormDependencies(info.type, $("#turnpoint-config"));
    if (mode == 'edit') {
      $("#turnpoint-config").modal();
      $("#add-turnpoint").hide();
      $("#edit-turnpoint").show();
      $("#delete-turnpoint").show();
    }
    else {
      $("#add-turnpoint").show();
      $("#edit-turnpoint").hide();
      $("#delete-turnpoint").hide();
    }
  }

  
  var collectForm = function() {
    var radius = !isNaN(parseInt($("#tp-radius-input").val())) ? parseInt($("#tp-radius-input").val()) : $("#tp-radius-input").attr('placeholder');
    var open = $("#tp-open-input").val() ? $("#tp-open-input").val() : $("#tp-open-input").attr('placeholder');
    var close = $("#tp-close-input").val() ? $("#tp-close-input").val() : $("#tp-close-input").attr('placeholder');
    
    return {
      close : close,
      goalType : $("#tp-goal-type-select").val(),
      index: $('#tp-index').val(),
      mode : $("#tp-mode-select").val(),
      open : open, 
      radius : radius,
      type : $("#tp-type-select").val(),
    } 
  }
 
  return {
    buildForm : buildForm,
    openConfigureWindow : openConfigureWindow,
  }
});
