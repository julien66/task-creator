/**
 * @file
 * Tracks module for the task planner
 */
define(['tracks/track'], function(Track) {
  
  var tracks = [];

  var addTrack = function(info) {
     var track = new Track(info);
     tracks.push(track);
     return track;
  }

  return {
    'addTrack' : addTrack,
  }
});
