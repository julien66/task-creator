require.config({
  baseUrl: '/',
  deps: ["demo/main"],
  paths: {
    text: "demo/vendor/requirejs-text/text",
    ejs:  "demo/vendor/ejs/ejs",
    rejs: "rejs"
  },
  shim: {
    ejs: {
      exports: 'ejs'
    }
  },
  urlArgs: "bust=" +  (new Date()).getTime()
});