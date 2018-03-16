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
    apiKey: info.fireBaseAPIkey,
    authDomain: info.firebaseProjectID,
    databaseURL: info.firebaseDatabaseName,
    // storageBucket: "<BUCKET>.appspot.com",
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var intialUrl = 'https://account.' + info.baseUrl + '/user/login';
var mapUrl = 'https://account.' + info.baseUrl + '/area-utente/map';
var dataUrl = 'https://account.' + info.baseUrl + '/area-utente/map/cars';
var areaUtente = 'https://account.' + info.baseUrl + '/area-utente';

function scrape() {
    console.log('scrape!');
    var nightmare = Nightmare({ show: false, openDevTools: false });
    nightmare
        .goto(intialUrl)
        .wait('input[value="Accedi"]')
        .type('input[name="identity"]', info.username)
        .type('input[name="credential"]', info.password)
        .wait(500 + 1000 * Math.random())
        .click('input[value="Accedi"]')
        .wait('a[href="/logout"]')
        .goto(dataUrl)
        .inject('js', './node_modules/d3/build/d3.js')
        .wait('pre')
        .evaluate(function() {
            return d3.select('pre').html();
        })
        // .goto(areaUtente)
        // .wait('a[href="/logout"]')
        // .click('a[href="/logout"]')
        .end()
        .then(function(result) {
            var data = JSON.parse(result);
            var now = d3.now();
            console.log('writing to firebase', timeFormatter(now));
            firebase.database().ref('/' + timeFormatter(now)).set({
                time: now,
                positions: data,
            });

        })
        .catch(function(error) {
            console.error('Search failed:', error);
        });
}

scrape();
setInterval(function() {
    scrape();
}, 1000 * 120);




