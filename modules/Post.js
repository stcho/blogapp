import React from 'react';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router'

var exampleComments = [
{
	_id: "12345", 
	imageurl: "https://lh6.googleusercontent.com/-Y0zBjmrIdNs/AAAAAAAAAAI/AAAAAAAAAJ4/gm0iMV4MR8I/s96-c/photo.jpg",
	body: "This is the first comment ever",
	timecreated: "09/29/2016 5:13pm",
	username: "Thomas Cho",
	postid: "12345" 
},
{
	_id: "67890", 
	imageurl: "https://lh4.googleusercontent.com/-OKsjuVxYkbE/AAAAAAAAAAI/AAAAAAAAAAA/APaXHhSXahTOshE0to3I4G7QI3_aAA2MbQ/s96-c/photo.jpg",
	body: "This is the second comment ever",
	timecreated: "09/29/2016 5:13pm",
	username: "Sungjae Cho",
	postid: "67890"
}
];

var Comment = React.createClass({
	render: function() {
		return (
			<div>
				<img className="CommentImg" src={this.props.imageurl} alt="Commenter picture" height="30" width="30" />
				<div className="CommentBody">
					<Link>{this.props.username}</Link> {this.props.body}
				</div>
				<div className="CommentTimeCreated">
					{this.props.timecreated}
				</div>
			</div>
		)
	}
})

var CommentList = React.createClass({
	handleCommentSubmit: function(e) {
		e.preventDefault();
		console.log("Submit");
		//if comment is not null create comment
	},

	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment key={comment._id} id={comment._id} imageurl={comment.imageurl} username={comment.username} body={comment.body} timecreated={comment.timecreated}></Comment>
			);
		});
		return (
			<div className="CommentBox">
				<hr/>
				{commentNodes}
				<img className="CommentImg" src={this.props.uimageurl} alt="Commenter picture" height="30" width="30" />
				<form name="createCommentForm" onSubmit={this.handleCommentSubmit}>
					<input className="CommentInput" type="text" placeholder="Write a comment..." />
				</form>
			</div>
		);
	}
});

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
					<div className="PostTimeCreated">
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
					<CommentList data={exampleComments} uimageurl={this.props.uimageurl}/>
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