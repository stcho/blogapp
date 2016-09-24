import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

export default React.createClass({
	getInitialState: function() {
		return { 
			user: [],
			showModal: false
		};
	},

	close: function() {
    this.setState({ showModal: false });
  },

  open: function() {
    this.setState({ showModal: true });
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

	onChangeCreatePostTextarea: function(e) {
		this.setState({ body: e.target.value });
	},

	render: function() {
		return (
			<div>
				<Grid>
					<Row>
						<Col md={3}>
							<img className="HomeProfileImg" src={this.state.user.imageurl} alt="User picture" height="60" width="60" />
							<span className="HomeProfileName"> {this.state.user.firstname} {this.state.user.lastname}</span> 
							<div className="CreatePostButton">
								<Button bsStyle="primary" onClick={this.open}>Create Post</Button>
							</div>
						</Col>
						<Col md={8}>
							<p>Create some posts and see them here!</p>
						</Col>
					</Row>
				</Grid>

				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Create Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form>
							<FormGroup controlId="CreatePostTitle">
								<FormControl placeholder="Title"></FormControl>
							</FormGroup>

							<FormGroup controlId="CreatePostTextarea">
				        <FormControl 
				          componentClass="textarea" 
				          placeholder="Write your post here"
				          value={this.state.body}
				          onChange={this.onChangeCreatePostTextarea}
				        >
				        </FormControl>
							</FormGroup> 
			        
			        <Button type="submit">
					      Submit
					    </Button>
			      </form>  
					</Modal.Body>
				</Modal>
			</div>
		)
	}
})