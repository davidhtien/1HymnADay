var Twit = require('twit')

var T = new Twit({
    consumer_key:         'lusIviTSOX1VG6iIGmJsg'
  , consumer_secret:      '27BHCYJdegUqx8fqGsk9jtKKgKtdDcx32TRr5iNoT4'
  , access_token:         '2357203652-SSw5tf76hdJCMacfo0czX52zkTVGjXs9E7rgO17'
  , access_token_secret:  'JJ9u4yErSa7iQC7PzHVlO2phYRgVAx4CefSpBS4jcADD0'
})

setInterval(function() {
    var categories = new Array('h', 'ns', 'nt', 'c')
    c = getRandomInt(0,3)

    
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}