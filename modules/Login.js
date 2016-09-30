import React from 'react'
import { browserHistory } from 'react-router'
import GoogleLogin from 'react-google-login'
import { Navbar, Nav, NavItem, Grid, Row, Col } from 'react-bootstrap'

const responseGoogle = (response) => {
  console.log("responseGoogle failed");
}

var User = React.createClass({
	render: function() {
		return (
			<div className="user">
				<span> {this.props.email}</span>
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
		fetch('/api/users', {credentials: 'include'}).then(response =>
			response.json()
		).then(data => {
			this.setState({ users: data });
		}).catch(err => {
			console.log(err);
		});
	},

	addUser: function(googleUser) {
		//response is a GoogleUser, all methods: https://developers.google.com/identity/sign-in/web/reference#users
	  // console.log(googleUser);
	  var profile = googleUser.getBasicProfile();
	  var newUser = {
	    'tokenid' : googleUser.tokenId,
	    'firstname' : profile.getGivenName(),
	    'lastname' : profile.getFamilyName(),
	    'imageurl' : profile.getImageUrl(),
	    'email' : profile.getEmail()
	  };

		fetch('/api/auth/google', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(newUser)
		}).then(response => 
			response.json()
		).then(data => {	
			var modifiedUsers = this.state.users.concat(data);
			this.setState({ users: modifiedUsers , signedInUser: data});
			const path = '/u/' + data._id; 
			browserHistory.push(path);
		}).catch(err => {
			console.log('Error adding user', err)
		});
		
	},

	render: function() {
		return (
			<div> 
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">BlogApp</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem href="#">Browse</NavItem>
						<NavItem href="#">About</NavItem>
					</Nav>
				</Navbar>
        
        <Grid>
    			<Row>
    				<Col md={12}>
							<h4>List Of All Users:</h4>
    					<UserList data={this.state.users} />
    					<br/>
    					<GoogleLogin
    clientId="663864375214-e2s33iqu1jqd1df07optmf3vib9p0982.apps.googleusercontent.com"
    buttonText="Google Sign-In"
    onSuccess={this.addUser}
    onFailure={responseGoogle} />
    				</Col>
    			</Row>
    		</Grid>

      </div>
		);
	}
});

