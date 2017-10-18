var d3 = require('d3');
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true, openDevTools: true });
var fs = require('fs');

// External json file called info.json

// {
//   "baseUrl" : "***",
//   "username" : "***",
//   "password" : "***"
// }

var info = JSON.parse(fs.readFileSync('./info.json'));

var baseUrl = info.baseUrl,
    username = info.username,
    password = info.password;

var intialUrl = 'https://account.'+baseUrl+'/user/login';
var mapUrl = 'https://account.'+baseUrl+'/area-utente/map';
var dataUrl = 'https://account.'+baseUrl+'/area-utente/map/cars';

nightmare
  .goto(intialUrl)
  .wait('input[value=Accedi]')
  .type('input[name=identity]',username)
  .type('input[name=credential]',password)
  .click('input[value=Accedi]')
  .goto(dataUrl)
  .inject('js','./node_modules/d3/build/d3.js')
  .wait('pre')
  .evaluate(function () {
    return d3.select('pre').html();
  })
  .end()
  .then(function (result) {
    var data = JSON.parse(result);
    var now = d3.now();
    console.log(now, data);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });