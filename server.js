var request = require('request');
var http = require('http');
var server = http.createServer(function (req, resp) {
  console.log(req.url);
  resp.setHeader('Access-Control-Allow-Origin', '*');
  request.get('http://www.pathwaycommons.org/' + req.url).pipe(resp);
});
server.listen('8777');
