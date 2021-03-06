var Twit = require('twit');
var express = require("express");
var app = express();
var request = require('request');

//import secret stuff
var config = require('./config')

//Twitter config
var T = new Twit({
    consumer_key:         config.consumer_key
  , consumer_secret:      config.consumer_secret
  , access_token:         config.access_token
  , access_token_secret:  config.access_token_secret
});

//server
var server_port = 8080
var server_ip_address = '127.0.0.1'

app.get('/', function(req, res){
    res.send('Hello world.');
});

app.get('/tweet', function(req, res) {
    res.send('tweeting one song')

    tweet();
});

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

//functionality
//implements the consistent post time, no longer needed now using heroku scheduler
function timer() {
    var now = new Date();
    var msUntil2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0, 0) - now;
    if (msUntil2 < 0) {
        msUntil2 += 86400000; // it's after 2pm, try 2pm tomorrow.
    }
    console.log("Time until tweet: " + msUntil2.toString() + "ms");

    setTimeout(function() {
        tweet();
        timer();
    }, msUntil2);
}

//selects category and song id to tweet then calls post
function tweet() {
    var base = 'http://hymnal-api.herokuapp.com/';
    var categories = new Array('h/', 'ns/', 'c/');
    var category = categories[getRandomInt(0,2)];

    try {
        if (category == 'h/') {
            var num = getRandomInt(1, 1348);
            var url = base + category + num.toString();
            console.log(url);
            post(num, url, category);
        } else if (category = 'ns/') {
            request(base + 'most_recent', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    console.log(data);
                    var max = data["New Song"];
                    console.log(max);
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
                    console.log(data);
                    var max = data["Children"];
                    console.log(max);
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
}

//composes tweet and posts it
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
                } else if (data["lyrics"]["chorus"] && length + data["lyrics"]["chorus"][i].length <= 140) {
                    length += data["lyrics"]["chorus"][i].length;
                    lyrics = lyrics + data["lyrics"]["chorus"][i] + "\n";
                }
            }

            var excess = lyrics.charAt(lyrics.length-2);
            if ((excess == "," || excess == ";") || excess == ".") {
                lyrics = lyrics.slice(0, lyrics.length-2) + "\n";
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
};

//random number generator
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};