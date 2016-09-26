import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

export default React.createClass({
	getInitialState: function() {
		return { 
			posts: [],
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
		
	},

	onChangeCreatePostTextarea: function(e) {
		this.setState({ body: e.target.value });
	},

	handleCreatePostSubmit: function(e) {
		e.preventDefault();
		var form = document.forms.createPostForm;
		this.createPost({title: form.title.value, body: form.body.value});
		//close modal
		this.close();
	},

	createPost: function(post) {
		console.log(post);
		fetch('/api/posts', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(post)
		}).then(response => 
			response.json()
		).then(data => {	
			var modifiedPosts = this.state.posts.unshift(data);
			this.setState({ posts: modifiedPosts });
		}).catch(err => {
			console.log('Error creating post', err)
		});
	},

	render: function() {
		return (
			<div>
				<Grid>
					<Row>
						<Col md={3}>
							<img className="HomeProfileImg" src={this.props.user.imageurl} alt="User picture" height="60" width="60" />
							<span className="HomeProfileName"> {this.props.user.firstname} {this.props.user.lastname}</span> 
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
						<form name="createPostForm">
							<FormGroup controlId="CreatePostTitle">
								<FormControl 
									placeholder="Title"
									name="title"
								>
								</FormControl>
							</FormGroup>

							<FormGroup controlId="CreatePostTextarea">
				        <FormControl 
				          componentClass="textarea" 
				          placeholder="Write your post here"
				          name="body"
				          value={this.state.body}
				          onChange={this.onChangeCreatePostTextarea}
				        >
				        </FormControl>
							</FormGroup> 
			        
			        <Button type="submit" onClick={this.handleCreatePostSubmit}>
					      Submit
					    </Button>
			      </form>  
					</Modal.Body>
				</Modal>
			</div>
		)
	}
})