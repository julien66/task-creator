# RequireJS EJS Plug-in

Use EJS templates with RequireJS. 

## Versions

rejs     : `0.3`

Dependencies (tested with, may work with newer versions):

ejs 	  : `0.8.3` ([github](https://github.com/visionmedia/ejs))  
requirejs : `2.1.5` ([github](https://github.com/jrburke/requirejs))  
text	  : `2.0.5` ([github](https://github.com/requirejs/text))

For Demo:

bower     : `0.8.5` ([github](https://github.com/twitter/bower))

## Demos

In order to view the demos, you'll need to install bower and have bower install the required libs.

    $ (sudo) npm install -g bower
    $ bower install
    $ npm install
    $ npm start

Go to http://localhost:4567/demo/index.html in your browser.

## TODO

+ (high priority) Add support for nested includes.
+ Add support for mixing in custom ejs filters.

## Tests

Coming soon.

## Inspiration

Inspired by and borrowed code from requirejs-hogan-plugin ([github](https://github.com/millermedeiros/requirejs-hogan-plugin)).
