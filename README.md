blogapp
=======

####About
Complete blogging application made with React, Express, Node, MongoDB, Webpack, React-Router, and Google Sign-In

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
db.users.insert([{googleid : 1, firstname : 'Test1FirstName', lastname : 'Test1LastName', imageurl : 'imageurl1', email : 'test1@test.com'}, {googleid : 2, firstname : 'John', lastname : 'Smith', imageurl : 'imageurl2', email : 'test2@test.com'}])
```

####Running Locally
```
npm start
```
Go to [http://localhost:3000](http://localhost:3000)