Complete blogging application made with React, Express, Node, MongoDB, Webpack, React-Router

npm install
npm start

Setting Up Initial Database with MongoDB
Download mongo
cd ~/path/to/mongodb/bin
mongo
var db = new Mongo().getDB("blogapp");
db.users.insert([{googleid : 1, firstname : 'Test1FirstName', lastname : 'Test1LastName', imageurl : 'imageurl1', email : 'test1@test.com'},{googleid : 2, firstname : 'John', lastname : 'Smith', imageurl : 'imageurl2', email : 'test2@test.com'}])
