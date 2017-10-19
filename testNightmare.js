var d3 = require('d3');
var Nightmare = require('nightmare');

function scrape() {
    console.log('scrape!');
    var nightmare = Nightmare({ show: false, openDevTools: false });
    nightmare
        .goto('http://google.com')
        .wait(2000)
        .inject('js', './node_modules/d3/build/d3.js')
        .wait(500)
        .evaluate(function() {
            return d3.select(body).html();
        })
        // .goto(areaUtente)
        // .wait('a[href="/logout"]')
        // .click('a[href="/logout"]')
        .end()
        .then(function(result) {
            console.log(result);
        })
        .catch(function(error) {
            console.error('Search failed:', error);
        });
}

scrape();
setInterval(function() {
    scrape();
}, 1000 * 10);




