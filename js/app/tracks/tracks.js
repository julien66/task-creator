/**
 * @file
 * Tracks module for the task planner
 */
define(['tracks/track', 'tracks/trackList'], function(Track, TrackList) {
  
  var tracks = [];

  var addTrackList = function(name) {
    
  } 

  var addTrack = function(info) {
     var track = new Track(info);
     tracks.push(track);
     TrackList.rebuild(tracks);
     return track;
  }

  return {
    'addTrack' : addTrack,
  }
});
