var express = require('express')
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var https = require('https');

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
POST Authentication
*/
app.post('/api/auth/google', function (req, res) {
	//grab id token, pull name and email from the req
	//with id token ask google who the user is
	
	var tokenid = req.body.tokenid;
	var email = req.body.email;
	var firstname = req.body.firstname
	var lastname = req.body.lastname
	var imageurl = req.body.imageurl

	https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + tokenid, (response) => {
		var body = '';
		response.on('data', (d) => { body += d});
		response.on('end', () => {
			var parsed = JSON.parse(body);
			if(parsed.iss != "accounts.google.com") {
				res.status(400).send("iss is not correct.");
				return
			} 
			else if(parsed.aud != "663864375214-e2s33iqu1jqd1df07optmf3vib9p0982.apps.googleusercontent.com") {
				res.status(400).send("aud is not correct.");
				return
			}
			else if(parsed.email != email) {
				res.status(400).send("email is not correct.");
				return
			}
			else {
				var newUser = {email: email, firstname: firstname, lastname: lastname, imageurl: imageurl}
				db.collection('users').insertOne(newUser, function(err, result) {
					var newId = result.insertedId;
					db.collection('users').find({_id: newId}).next(function(err, docs) {
						res.json(docs);
					})
				})
			}
		})
	})

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

/*
GET one Post
*/

/*
POST one Post
*/

// send all requests to index.html so browserHistory works for react-router
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

