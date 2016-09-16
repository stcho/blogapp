import React from 'react'

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
		return {data: []};
	},

	loadUsersFromServer: function() {
		console.log("Hello?");
		fetch('/api/users').then(response =>
			response.json()
		).then(data => {
			console.log("Success");
			this.setState({ data });
		}).catch(err => {
			console.log(err);
		});
	},

	componentDidMount: function() {
		this.loadUsersFromServer();
	},

	render: function() {
		return (
			<div className="userBox"> 
        <UserList data={this.state.data} />
      </div>
		);
	}
});

