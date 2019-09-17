const path = require('path');
const express = require('express');
var bodyParser = require("body-parser");

const http = require('http');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/loginDime', ({query, headers}, res) => {
  let tipologia = query.tipologia
    ? 'url=/segnala&state=' + encodeURIComponent('tipologia=' + query.tipologia)
    : '';
  
  let token = query.token || headers['Authorization'] || '';
  
  res.redirect(302, token == ''
    ? '/'
    : '/login?data=' + token + '&' + tipologia
  );
});

app.get('/*', (_, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

app.post('/login/success', ({body}, res) => res.redirect(302, '/login?data=' + encodeURIComponent(body.data)));

var httpServer = http.createServer(app);
httpServer.listen(3000);