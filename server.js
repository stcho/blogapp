var express = require('express')
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var app = express()
var db;

app.use(compression());
app.use(bodyParser.json());

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

/* 
GET all Users 
*/
app.get('/api/users', function (req, res) {
	db.collection('users').find().toArray(function(err, docs) {
		res.json(docs);
	});
});

/* 
GET one User
*/
app.get('/api/users/:id', function (req, res) {
	db.collection('users').findOne({_id: ObjectId(req.params.id)}, function(err, user) {
		res.json(user);
	});
});

/* 
POST one User 
*/
app.post('/api/users', function (req, res) {
	console.log("Req body:", req.body);
	var newUser = req.body;
	db.collection('users').insertOne(newUser, function(err, result) {
		var newId = result.insertedId;
		db.collection('users').find({_id: newId}).next(function(err, docs) {
			res.json(docs);
		})
	})
});

// send all requests to index.html so browserHistory works for react-router
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

