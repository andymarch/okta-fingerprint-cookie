require('dotenv').config()
var express = require('express');
const history = require('connect-history-api-fallback');
var path = require('path');
var serveStatic = require('serve-static');

app = express();
app.use(serveStatic(__dirname + "/dist"));
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(serveStatic(__dirname + "/dist"));

var port = process.env.PORT || 8080;
app.listen(port);

console.log('server started '+ port);
