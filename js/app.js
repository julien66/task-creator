/**
 * @file
 * JS starter for requirejs.
 * Performs Configuration, Dependency tracker.
 * Load the main.js entry point.
 */

/**
 * Configuration settings for requirejs.
 */
requirejs.config({
  baseUrl : "js/lib",
  urlArgs: "bust=" + (new Date()).getTime(),
  paths : {
    app : "../app",
    async : "requirejs-plugins/src/async",
    bootstrap : "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
    css: "require-css/css",
    Dropzone : "dropzone/downloads/dropzone-amd-module",
    ejs : 'ejs-0.8.3/ejs',
    formats : '../app/formats', 
    jquery : "jquery-1.11.1",
    'jquery-ui' : "jquery-ui-1.11.0.custom/jquery-ui",
    rejs : 'requirejs-ejs/rejs',
    styles : "../../css",
    task : "../app/task",
    text : "text/text",
    tracks : "../app/tracks",
    waypoints : "../app/waypoints",
    jgrowl : "jGrowl/jquery.jgrowl",
  },
  shim : {
    bootstrap : {
      deps : ['jquery'],
    },
    ejs : {
      exports: 'ejs',
    },
    'jgrowl' : {
      deps : ['jquery'],
      exports : 'jQuery.fn.jGrowl',
    },
  },
});


/**
 * Dependency tracker for requirejs.
 *
 * @link https://gist.github.com/dustinboston/3288778
 * Methods available after page load:
 * rtree.map()
 *  - Fills out every module's map property under rtree.tree.
 *  - Print out rtree.tree in the console to see their map property.
 * rtree.toUml()
 *  - Prints out a UML string that can be used to generate UML
 *  - UML Website: http://yuml.me/diagram/scruffy/class/draw
 */
requirejs.onResourceLoad = function (context, map, depMaps) {
  if (!window.rtree) {
    window.rtree = {
      tree: {},
      map: function() {
        for (var key in this.tree) {
          if (this.tree.hasOwnProperty(key)) {
            var val = this.tree[key];
            for (var i =0; i < val.deps.length; ++i) {
              var dep = val.deps[i];
              val.map[dep] = this.tree[dep];
            }
          }
        }
      },
      toUml: function() {
        var uml = [];
        for (var key in this.tree) {
          if (this.tree.hasOwnProperty(key)) {
            var val = this.tree[key];
            for (var i = 0; i < val.deps.length; ++i) {
              uml.push("[" + key + "]->[" + val.deps[i] + "]");
            }
          }
        }
        return uml.join("\n");
      }
    };
  }
  
  var tree = window.rtree.tree;
  function Node() {
    this.deps = [];
    this.map = {};
  }

  if (!tree[map.name]) {
    tree[map.name] = new Node();
  }
  
  // For a full dependency tree
  if (depMaps) {
    for (var i = 0; i < depMaps.length; ++i) {
      tree[map.name].deps.push(depMaps[i].name);
    }
  }
  
  // For a simple dependency tree
  /*if (map.parentMap && map.parentMap.name) {
    if (!tree[map.parentMap.name]) {
      tree[map.parentMap.name] = new Node();
    }
    if (map.parentMap.name !== map.name) {
      tree[map.parentMap.name].deps.push(map.name);
    }
  }*/  
};

/**
 * Finally load the main app module to start the app
 */
 requirejs(["app/main"]);
