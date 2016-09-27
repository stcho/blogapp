var express = require('express')
var path = require('path')
var compression = require('compression')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var https = require('https');
var session = require('express-session')

var app = express()
var db;

app.use(session({
	secret: 'keyboard cat2', 
	cookie: { maxAge: 259200000 },
	saveUninitialized: false,
	resave: false
}))
app.use(compression());
app.use(bodyParser.json());

/*
Serve our static files in static
*/
app.use('/static', express.static(path.join(__dirname, 'static')))

/*
Connect to mongodb client and listen on localhost:3000
*/
MongoClient.connect('mongodb://localhost/blogapp', function(err, dbConnection) {
	db = dbConnection;
	var server = app.listen(3000, function() {
		var port = server.address().port;
		console.log("Started server at port", port);
	});
});

/*
POST Authentication and User Creation
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
						req.session.userId = newId;
						console.log(req.session.userId)
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
GET signed in User
*/
app.get('/api/signedinuser/', function (req, res) {
	console.log("GET signed in User /api/signedinuser/", req.session.userId)
	db.collection('users').findOne({_id: ObjectId(req.session.userId)}, function(err, user) {
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
GET all Post for User id
*/
app.get('/api/posts', function (req, res) {
	db.collection('posts').find({userId: req.session.userId}).toArray(function(err, docs) {
		res.json(docs);
	})
})

/*
POST one Post
*/
app.post('/api/posts', function(req, res) {
	if(!req.session.userId) {
		console.log("Error creating post: User session missing");
		res.status(400).send('Error creating post: User session missing');
		return
	}
	var newPost = req.body;
	newPost.userId = req.session.userId;
	db.collection('posts').insertOne(newPost, function(err, result) {
		var newPostId = result.insertedId;
		db.collection('posts').find({_id: newPostId}).next(function(err, docs) {
			res.json(docs);
		})
	})
})

/*
App Component
*/
app.get('/u/*', function (req, res) {
	//If there is no user session redirect to Login
	//Else render App Component
	if(req.session.userId == null) {
		console.log("Redirect to home page from /u/*");
		res.redirect('/');
		return
	}
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

/*
Login Component
*/
app.get('/', function (req, res) {
	//If user session already exists redirect to Home
	//Else render Login
	if(req.session.userId != null) {
		res.redirect('/u/' + req.session.userId);
		return
	}
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

/*
Send all requests to index.html so browserHistory works for react-router
*/
app.get('*', function (req, res) {
	res.status(404).sendFile(path.join(__dirname, 'static', 'index.html'))
})