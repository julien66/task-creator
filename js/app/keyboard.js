/**
 * @file
 * Keyboard module for the task creator.
 */
define([], function() {
  var downKeys = {};
  
  var onKeyDown = function(e) {
    e.preventDefault();
    e.stopPropagation();
    downKeys[e.keyCode] = true;
  }
  
  var onKeyUp = function(e) {
    e.preventDefault();
    e.stopPropagation();
    delete downKeys[e.keyCode];
  }
  
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  
  var getKeys = function() {
    return downKeys;
  }
  
  var isKeysDown = function(keys) {
    for (var i in keys) {
      if (!downKeys[keys[i]]) {
        return false;
      }
    }
    return true;
  }
  
  return {
    isKeysDown : isKeysDown,
    getKeys : getKeys,
  }
});
