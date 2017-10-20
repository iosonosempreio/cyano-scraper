var d3 = require('d3');
var Nightmare = require('nightmare');
var fs = require('fs');
var firebase = require('firebase');

// External json file called info.json
// {
//   "baseUrl" : "***",
//   "username" : "***",
//   "password" : "***",
//   etc...
// }

console.log('load info')
var info = JSON.parse(fs.readFileSync('./info.json'));
var timeFormatter = d3.timeFormat("%Y-%m-%d %H:%M:%S");
console.log(info);

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: info.fireBaseAPIkeyArea,
    authDomain: info.firebaseProjectIDArea,
    databaseURL: info.firebaseDatabaseNameArea,
    // storageBucket: "<BUCKET>.appspot.com",
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var intialUrl = 'https://account.' + info.baseUrl + '/user/login';
var mapUrl = 'https://account.' + info.baseUrl + '/area-utente/map';
var dataUrl = 'https://account.' + info.baseUrl + '/area-utente/map/cars';
var areaUtente = 'https://account.' + info.baseUrl + '/area-utente';

function validArea() {
    console.log('scrape valid area!');
    var nightmare = Nightmare({ show: false, openDevTools: false });

    nightmare
        .goto(intialUrl)
        .wait('input[value="Accedi"]')
        .type('input[name="identity"]', info.username)
        .type('input[name="credential"]', info.password)
        .wait(500 + 1000 * Math.random())
        .click('input[value="Accedi"]')
        .wait('a[href="/logout"]')
        .goto(mapUrl)
        .inject('js', './node_modules/d3/build/d3.js')
        .wait('a[href="/logout"]')
        .evaluate(function() {
        	return validZonesJson
        })
        .end()
        .then(function(result) {
            var now = d3.now();
            console.log('writing to firebase', timeFormatter(now));
            firebase.database().ref('/validArea/' + timeFormatter(now)).set({
                time: now,
                area: result,
            });

        })
        .catch(function(error) {
            console.error('Search failed:', error);
        });

}

validArea();
setInterval(function() {
    validArea();
}, 1000 * 60 * 24);