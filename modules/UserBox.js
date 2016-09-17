import React from 'react'
import { browserHistory } from 'react-router'
import GoogleLogin from 'react-google-login'

var newUser = {
	'googleid' : 3, 
	'firstname' : 'Test3FirstName', 
	'lastname' : 'Test3LastName', 
	'imageurl' : 'imageurl3', 
	'email' : 'test3@test.com'
}

const responseGoogle = (response) => {
  console.log(response);
}

var User = React.createClass({
	render: function() {
		return (
			<div className="user">
				{this.props.firstname}
				{this.props.email}
			</div>
		);
	}
});

var UserList = React.createClass({
	render: function() {
		var userNodes = this.props.data.map(function(user) {
			return (
				<User key={user._id} firstname={user.firstname} email={user.email} ></User>
			);
		});
		return (
			<div className="userList"> 
        {userNodes}
      </div>
		);
	}
});

export default React.createClass({
	getInitialState: function() {
		return {users: []};
	},

	componentDidMount: function() {
		this.loadUsersFromServer();
	},

	loadUsersFromServer: function() {
		fetch('/api/users').then(response =>
			response.json()
		).then(data => {
			this.setState({ users: data });
		}).catch(err => {
			console.log(err);
		});
	},

	addUser: function() {
		fetch('/api/users', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(newUser)
		}).then(response => 
			response.json()
		).then(data => {
			console.log("Inside modifiedUser")
			var modifiedUsers = this.state.users.concat(data);
			this.setState({ users: modifiedUsers });
		}).catch(err => {
			console.log('Error adding user', err)
		});
	},

	render: function() {
		return (
			<div className="userBox"> 
        <UserList data={this.state.users} />
        <button onClick={this.addUser}>Add User</button>
        <br/>
        <GoogleLogin
    clientId="663864375214-e2s33iqu1jqd1df07optmf3vib9p0982.apps.googleusercontent.com"
    buttonText="Google Sign-In"
    onSuccess={responseGoogle}
    onFailure={responseGoogle} />
      </div>
		);
	}
});

