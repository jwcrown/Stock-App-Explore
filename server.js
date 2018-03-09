var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var port = 8000;

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// routes
app.post('/api/stocks', function (req, res) {  //makes API request and could save in DB for future scalibilty
    console.log('Received a post request');    
    var symbol = req.body["symbol"];
    request.get(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbol}&apikey=5JDXUKAXI0UOHV3D`, function (error, response, body) {
        console.log(body);
        res.json(JSON.parse(body));
    });
});

app.listen(port);
console.log('listening on port ' + port);