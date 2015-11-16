/**
 @ file
 * Modal window for the task creator
 */
define(['jquery'], function($) {
  var overlay = $("#overlay");
  var container = $("#modal-container");
  var nb = 0;

  $(document).on('click', '#overlay', function(e) {
    overlay.hide();
    clear();
  });

  $(document).on('click', '#modal-close', function(e) {
    var windowClass = $(this).parent().attr('class');
    $('.' + windowClass).remove();
    checkOverlay();
  })

  var clear = function() {
    $("#modal-window").remove();
    overlay.hide();
  }

  var remove = function(modalWindow) {
    modalWindow.remove();
    checkOverlay();
  }

  var checkOverlay = function() {
    if (!$("#modal-window").length) {
      overlay.hide();
    }
  }

  var add = function(content) {
    overlay.show();
    var template = buildTemplate(content);
    container.append(template);
    var modalWindow = $('.modal-' + nb)
    modalWindow.css('z-index', 10000001 + nb);
    nb++;
    return modalWindow;
  }

  var buildTemplate = function(html) {
    template = '<div id="modal-window" class="modal-' + nb + '">' +
      '<div id="modal-close"></div>' +
      '<div id="modal-content">' +
        html +
      '</div>' +
    '</div>';
    return template;
  }

   return {
     add : add,
     remove : remove,
   };
 });
