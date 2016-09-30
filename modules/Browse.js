import React from 'react'
import { Grid, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router'

var User = React.createClass({
  render: function() {
    var profilePath = '/profile/' + this.props.id;
    return (
      <div className="card">
        <img className="cardImg" src={this.props.imageurl} alt="User picture" height="60" width="60" />
        <div className="cardName">
          <a href={profilePath}> {this.props.firstname} {this.props.lastname}</a>
        </div>
        <div className="cardDetail">{this.props.email}</div>
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    var userNodes = this.props.data.map(function(user) {
      return (
        <User key={user._id} id={user._id} firstname={user.firstname} lastname={user.lastname} email={user.email} imageurl={user.imageurl} ></User>
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

  render: function() {
    return (
    	<div>
    		<Grid>
    			<Row>
    				<Col md={12}>
              <UserList data={this.state.users} />
    				</Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
