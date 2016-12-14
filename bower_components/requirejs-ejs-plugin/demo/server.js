var express, app;

express = require("express");
app = express();

app.configure(function(){
  app.use(express.static(__dirname + '/../'));
});

app.get("/", function(req, res) {
  res.redirect("index.html");
});

app.listen(4567);