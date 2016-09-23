import React from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap'

export default React.createClass({
	getInitialState: function() {
		return { user: [] };
	},

	componentDidMount: function() {
		this.loadUser();
	},

	loadUser: function() {
		fetch('/api/users/' + this.props.params.userId).then(response =>
			response.json()		
		).then(data => {
			this.setState({user: data});
		}).catch(err => {
			console.log(err);
		});
	},

	render: function() {
		return (
			<div>
				<Grid>
					<Row>
						<Col md={4}>
							<img className="HomeProfileImg" src={this.state.user.imageurl} alt="User picture" height="60" width="60" />
							<span className="HomeProfileName"> {this.state.user.firstname} {this.state.user.lastname}</span> 
							<div className="CreatePostButton">
								<Button bsStyle="primary">Create Post</Button>
							</div>
						</Col>
						<Col md={8}>
							Create some posts and see them here!
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
})