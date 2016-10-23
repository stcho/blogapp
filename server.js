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
				//If no user with email was found in db create user.
				//Else send found user
				db.collection('users').find({email: email}).next(function(err, data) {
					if (data === null) {
						var newUser = {email: email, firstname: firstname, lastname: lastname, imageurl: imageurl}
						db.collection('users').insertOne(newUser, function(err, result) {
							var newId = result.insertedId;
							db.collection('users').find({_id: newId}).next(function(err, docs) {
								req.session.userId = newId;
								res.json(docs);
							})
						})
					} 
					else {
						req.session.userId = data._id;
						res.json(data);
					}
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
	db.collection('users').findOne({_id: ObjectId(req.session.userId)}, function(err, user) {
		res.json(user);
	});
});

/* 
GET User for Profile
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
PUT one User 
*/
app.put('/api/users', function (req, res) {
	db.collection('users').updateOne({_id: ObjectId(req.session.userId)}, req.body, function(err, result) {
		if (err) console.log(err);
		db.collection('users').findOne({_id: ObjectId(req.session.userId)}, function(err, user) {
			if (err) console.log(err);
			res.json(user);
		});
	})
})

/*
GET all Post for signed in User 
*/
app.get('/api/posts', function (req, res) {
	db.collection('posts').find({userId: req.session.userId}).toArray(function(err, docs) {
		res.json(docs);
	})
})

/*
GET all Post for Profile 
*/
app.get('/api/posts/:id', function (req, res) {
	db.collection('posts').find({userId: req.params.id}).toArray(function(err, docs) {
		res.json(docs);
	})
})

/*
POST one Post
*/
app.post('/api/posts', function (req, res) {
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
DELETE one Post
*/
app.delete('/api/posts/:id', function (req, res) {
	if(!req.session.userId) {
		console.log("Error deleting post: User session missing");
		res.status(400).send('Error deleting post: User session missing');
		return
	}
	var postToDelete = req.params.id;
	db.collection('posts').remove({_id: ObjectId(postToDelete)}, function(err) {
		res.status(400).send('Error removing post from db: ', err);
	});
	db.collection('comments').remove({postid: postToDelete}, function(err) {	
	});
})

/*
PUT one Post
*/
app.put('/api/posts/:id', function (req, res) {
	req.body.userId = req.session.userId;
	db.collection('posts').updateOne({_id: ObjectId(req.params.id)}, req.body, function(err, result) {
		if (err) console.log(err);
		db.collection('posts').findOne({_id: ObjectId(req.params.id)}, function(err, post) {
			if (err) console.log(err);
			res.json(post);
		});
	})
})

/*
GET comments
*/
app.get('/api/comments/:id', function (req, res) {
	db.collection('comments').find({postid: req.params.id}).toArray(function(err, docs) {
		res.json(docs);
	})
})

/*
POST comment
*/
app.post('/api/comments', function (req, res) {
	if(!req.session.userId) {
		console.log("Error creating post: User session missing");
		res.status(400).send('Error creating post: User session missing');
		return
	}
	var newComment = req.body;
	db.collection('comments').insertOne(newComment, function(err, result) {
		var newCommentId = result.insertedId;
		db.collection('comments').find({_id: newCommentId}).next(function(err, docs) {
			res.json(docs);
		})
	})
})

/*
DELETE one comment
*/
app.delete('/api/comments/:id', function (req, res) {
	if(!req.session.userId) {
		console.log("Error deleting comment: User session missing");
		res.status(400).send('Error deleting comment: User session missing');
		return
	}
	var commentToDelete = req.params.id;
	db.collection('comments').remove({_id: ObjectId(commentToDelete)}, function(err) {
		res.status(400).send('Error removing comment from db: ', err);
	})
})

/*
User Component
*/
app.get('/user/:id', function (req, res) {
	//If user session is not equal to req.params.id redirect to login
	//Else sendfile for User to be rendered with user req.params.id
	if(req.session.userId == null || req.session.userId != req.params.id) {
		console.log("Redirect to login page from /user/:id");
		res.redirect('/');
		return
	}
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

/*
Profile Component
*/
app.get('/profile/:id', function (req, res) {
	//If user session is equal to req.params.id redirect to user edit page
	//Else sendfile for Profile to be rendered with user req.params.id
	if(req.session.userId == null) {
		console.log("Redirect to login page from /profile/:id");
		res.redirect('/');
		return
	}
	if(req.session.userId == req.params.id) {
		res.redirect('/u/' + req.session.userId);
		return
	}
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
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