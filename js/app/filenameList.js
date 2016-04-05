/**
 * @file
 * filename list module for the task creator.
 */
define(['jquery'], function($) {
  var container = $("#file-handler");
  $(document).on('click', '#filenameList', function(e) { 
    var name = $(this).attr('class');
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('filenameRemoved', false, false, {
      filename : name, 
    });
    document.dispatchEvent(e);
  });

  var rebuild = function(filenames) {
    if (filenames.length > 0) {
      var html ='';
      for (var i = 0; i < filenames.length; i++) {
        html += '<li id="filenameList" class="' + filenames[i] + '"><i class="fa fa-trash"></i> ' + filenames[i] + '</li>';
      }
      container.html(html);
      container.addClass('populated');
    } else {
      container.removeClass('populated');
      container.html('');
    }
  }

  return {
    rebuild : rebuild,
  }
});
