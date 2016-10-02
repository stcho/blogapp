import React from 'react';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

export default React.createClass({
	getInitialState: function() {
		return { 
			showUpdatePostModal: false,
			title: this.props.title,
			body: this.props.body
		};
	},

	closeUpdatePostModal: function() {
    this.setState({ showUpdatePostModal: false });
  },

  openUpdatePostModal: function() {
    this.setState({ showUpdatePostModal: true });
  },

  onChangeUpdatePostTitle: function(e) {
		this.setState({ title: e.target.value });
	},

	onChangeUpdatePostBody: function(e) {
		this.setState({ body: e.target.value });
	},

	handleDelete: function(e) {
		e.preventDefault();
		this.props.deletePost(this.props.id);
	},

	handleUpdatePostSubmit: function(e) {
		e.preventDefault();
		this.props.updatePost(this.props.id, {title: this.state.title, body: this.state.body, timecreated: this.props.timecreated});
		//close modal
		this.closeUpdatePostModal();
	},

	render: function() {
		return (
			<div>
				<div className="PostBox">
					<div className="PostTitle">
						{this.props.title}
					</div>
					<div className="PostDate">
						{this.props.timecreated}
					</div>
					<div className="PostDelete">
						<Button onClick={this.handleDelete}>x</Button>
					</div>
					<div className="PostUpdate">
						<Button onClick={this.openUpdatePostModal}>u</Button>
					</div>
					<div className="PostBody">
						{this.props.body}
					</div>
				</div>

				<Modal show={this.state.showUpdatePostModal} onHide={this.closeUpdatePostModal}>
					<Modal.Header closeButton>
						<Modal.Title>Update Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form name="createPostForm">
							<FormGroup controlId="CreatePostTitle">
								<FormControl 
									placeholder="Title"
									name="title"
									value={this.state.title}
									onChange={this.onChangeUpdatePostTitle}
								>
								</FormControl>
							</FormGroup>

							<FormGroup controlId="CreatePostTextarea">
				        <FormControl 
				          componentClass="textarea" 
				          placeholder="Write your post here"
				          name="body"
				          value={this.state.body}
				          onChange={this.onChangeUpdatePostBody}
				        >
				        </FormControl>
							</FormGroup> 
			        
			        <Button bsStyle="warning" type="submit" onClick={this.handleUpdatePostSubmit}>
					      Update
					    </Button>
			      </form>  
					</Modal.Body>
				</Modal>
			</div>
		);
	}
});