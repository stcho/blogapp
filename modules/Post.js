import React from 'react';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router'


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
});


var CommentList = React.createClass({
	getInitialState: function() {
		return {
			body: ""
		};
	},

	handleCommentSubmit: function(e) {
		e.preventDefault();
		var newDate = new Date();
		//if comment is not null create comment
		if(this.state.body != "") {
			this.props.createComment({imageurl: this.props.uimageurl, body: this.state.body, timecreated: this.props.convertDate(newDate), postid: this.props.postid, username: this.props.username})
			this.setState({ body: "" }, function () {
			    // clear comment input value
			    document.getElementById("CommentInput").value = "";
			});
		}
	},

	onChangeComment: function(e) {
		this.setState({ body: e.target.value });
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
					<input id="CommentInput" type="text" placeholder="Write a comment..." onChange={this.onChangeComment}/>
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
			body: this.props.body,
			comments: []
		};
	},

	componentDidMount: function() {
		this.loadComments();
	},

	loadComments: function() {
		fetch('/api/comments/'+this.props.id, {credentials: 'include'}).then(response =>
			response.json()
		).then(data => {
			// var flipData = data.reverse()
			this.setState({ comments: data });
		}).catch(err => {
			console.log(err);
		});
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
		this.props.updatePost(this.props.id, {title: this.state.title, body: this.state.body, timecreated: this.props.timecreated, username: this.props.username});
		//close modal
		this.closeUpdatePostModal();
	},

	createComment: function(comment) {
		fetch('/api/comments', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(comment)
		}).then(response => 
			response.json()
		).then(data => {	
			var dataArray = [data];
			var modifiedComments = dataArray.concat(this.state.comments);
			this.setState({ comments: modifiedComments });
		}).catch(err => {
			console.log('Error creating comment', err)
		});
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
					<CommentList data={this.state.comments} createComment={this.createComment} uimageurl={this.props.uimageurl} convertDate={this.props.convertDate} postid={this.props.id} username={this.props.username} />
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