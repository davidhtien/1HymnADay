var Twit = require('twit');
var express = require("express");
var app = express();
request = require('request');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.get('/', function(req, res){
    res.send('Hello world.');
});

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

var T = new Twit({
    consumer_key:         'H10n1pK0srAmOLpymYn0rg'
  , consumer_secret:      'fPzrJJgnZRtUcojRhULVVerGcLaNPyKOXj9q15VoHTU'
  , access_token:         '2357203652-ome6EWChcTqBB8LdTITRXolhaWKybmmQnHlwxaV'
  , access_token_secret:  'AHFAD68NZYTajEF3eaozlP2D5F7GL8iroSpiRnIX1nbJs'
});

setInterval(function() {
	var base = 'http://hymnal-api.herokuapp.com/';
    var categories = new Array('h/', 'ns/', 'c/');
    var category = categories[getRandomInt(0,2)];
    //var category = 'ns/';

    try {
        if (category == 'h/') {
            var num = getRandomInt(1, 1348);
            var url = base + category + num.toString();
            //console.log(url);
            post(num, url, category);
        } else if (category = 'ns/') {
            request(base + 'most_recent', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    //console.log(data);
                    var max = data["New Song"];
                    //console.log(max);
                    var num = getRandomInt(1, max);
                    var url = base + category + num.toString();
                    console.log(url);
                    post(num, url, category);
                } else {
                    console.log(error);
                };
            });
        } else {
            request(base + 'most_recent', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    //console.log(data);
                    var max = data["Children"];
                    //console.log(max);
                    var num = getRandomInt(1, max);
                    var url = base + category + num.toString();
                    post(num, url, category);
                } else {
                    console.log(error);
                };
            });
        }
    } catch (err) {
        console.log(err);
    }

}, 60000);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function post(num, url, category) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var s_url = "http://hymnal.net/en/hymn/" + category + num.toString();
            var length = s_url.length;
            var lyrics = ""
            for (var i=0; i < 2; i++) {
                if (data["lyrics"]["stanza 1"] && length + data["lyrics"]["stanza 1"][i].length <= 140) {
                    length += data["lyrics"]["stanza 1"][i].length;
                    lyrics = lyrics + data["lyrics"]["stanza 1"][i] + "\n";
                } else if (data["lyrics"]["nonum"] && length + data["lyrics"]["nonum"][i].length <= 140) {
                    length += data["lyrics"]["nonum"][i].length;
                    lyrics = lyrics + data["lyrics"]["nonum"][i] + "\n";
                }
            }

            var tweet = lyrics + s_url;
            console.log(tweet);
            console.log(length);
            T.post('statuses/update', { status: tweet }, function(err, reply) {
                if (!err) {
                    console.log(reply['created_at']);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(error);
        };
    });
}