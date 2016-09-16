var express = require('express')
var path = require('path')
var compression = require('compression')
var MongoClient = require('mongodb').MongoClient;

var app = express()
var db;

app.use(compression())

// serve our static files in public
app.use(express.static(path.join(__dirname, 'public')))

// connect to mongodb client
MongoClient.connect('mongodb://localhost/blogapp', function(err, dbConnection) {
	db = dbConnection;
	var server = app.listen(3000, function() {
		var port = server.address().port;
		console.log("Started server at port", port);
	});
});

app.get('/api/users', function (req, res) {
	db.collection('users').find().toArray(function(err, data) {
		res.json(data);
	});
});

// send all requests to index.html so browserHistory works for react-router
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

