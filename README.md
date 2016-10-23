blogapp
=======

####About
Complete blogging application made with React, Express, Node, MongoDB, Webpack, React-Router, React-Bootstrap, and Google Sign-In

####Features
* Google sign-in and authentication
* User Profiles with corresponding Posts
* User Creation
* User Update/Edit
* Post Creation
* Post Deletion
* Post Update/Edit
* Comment Creation
* Comment Deletion

####Setup
```
npm install
```

####Setting Up Initial Database with MongoDB
Download [MongoDB](https://www.mongodb.com/download-center#community)
```
cd ~/path/to/mongodb/bin
mongo
var db = new Mongo().getDB("blogapp");
```

####Running Locally
```
npm start
```
Go to [http://localhost:3000](http://localhost:3000)

####To Do
When deleting post delete its comments as well, Sign out, Nav-Bar Active State