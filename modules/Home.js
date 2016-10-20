import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

import Post from './Post'

var PostList = React.createClass({
	render: function() {
		var deletePost = this.props.deletePost;
		var updatePost = this.props.updatePost;
		var uimageurl = this.props.uimageurl;
		var convertDate = this.props.convertDate;
		var postNodes = this.props.data.map(function(post) {
			return (
				<Post key={post._id} convertDate={convertDate} uimageurl={uimageurl} updatePost={updatePost} deletePost={deletePost} id={post._id} title={post.title} body={post.body} timecreated={post.timecreated} username={post.username}></Post>
			);
		});
		return (
			<div> 
        {postNodes}
      </div>
		);
	}
});

export default React.createClass({
	getInitialState: function() {
		return { 
			posts: [],
			showCreatePostModal: false
		};
	},

	closeCreatePostModal: function() {
    this.setState({ showCreatePostModal: false });
  },

  openCreatePostModal: function() {
    this.setState({ showCreatePostModal: true });
  },

	componentDidMount: function() {
		this.loadPosts();
	},

	loadPosts: function() {
		fetch('/api/posts', {credentials: 'include'}).then(response =>
			response.json()
		).then(data => {
			var flipData = data.reverse()
			this.setState({ posts: data });
		}).catch(err => {
			console.log(err);
		});
	},

	onChangeCreatePostTitle: function(e) {
		this.setState({ title: e.target.value });
	},

	onChangeCreatePostBody: function(e) {
		this.setState({ body: e.target.value });
	},

	convertDate: function(date) {
		var dd = date.getDate();
		var mm = date.getMonth()+1; //January is 0
		var yyyy = date.getFullYear();
		var hours = date.getHours();
		var mins = date.getMinutes();

		if(dd<10) {
		  dd='0'+dd;
		} 
		if(mm<10) {
		  mm='0'+mm;
		}
		if(mins<10) {
			mins='0'+mins;
		}
		if(hours<=12) {
			hours=hours;
			mins=mins+'am';
		} 
		if(hours>12) {
			hours=hours-12;
			mins=mins+'pm';
		}

		date = mm+'/'+dd+'/'+yyyy+' '+hours+':'+mins ; 
		return date;
	},

	handleCreatePostSubmit: function(e) {
		e.preventDefault();	
		var newDate = new Date();
		var form = document.forms.createPostForm;
		var username = this.props.user.firstname + " " + this.props.user.lastname;
		this.createPost({title: form.title.value, body: form.body.value, timecreated: this.convertDate(newDate), username: username});
		this.setState({ title: '' });
		this.setState({ body: '' });
		//close modal
		this.closeCreatePostModal();
	},

	createPost: function(post) {
		fetch('/api/posts', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(post)
		}).then(response => 
			response.json()
		).then(data => {	
			var dataArray = [data];
			var modifiedPosts = dataArray.concat(this.state.posts);
			this.setState({ posts: modifiedPosts });
		}).catch(err => {
			console.log('Error creating post', err)
		});
	},

	deletePost: function(id) {
		var confirmation = confirm('Are you sure you want to delete this post?');
		if (confirmation === true) {
			fetch('/api/posts/'+id, {
				method: 'DELETE',
				credentials: 'include'
			}).catch(err => {
				console.log('Error deleting user', err)
			});
			//find specific post with id in this.state.posts and delete it
			function findDeletedPost(post) {
				return post._id == id;;
			}
			var postsArray = this.state.posts;
			var indexToSplice = this.state.posts.findIndex(findDeletedPost)
			postsArray.splice(indexToSplice, 1);
			this.setState({ posts: postsArray });
		}
	},

	updatePost: function(id, post) {
		fetch('/api/posts/'+id, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(post)
		}).then(response =>
			response.json()
		).then(data => {
			//find specific post with id in this.state.posts and update it with data
			function findUpdatingPost(p) {
				return p._id == id;;
			}
			var postsArray = this.state.posts;
			var indexToUpdate = this.state.posts.findIndex(findUpdatingPost)
			postsArray[indexToUpdate] = data;
			this.setState({ posts: postsArray });
		}).catch(err => {
      console.log('Error updating Post', err)
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
							<div className="HomeProfileBio">{this.props.user.bio}</div>
							<div className="CreatePostButton">
								<Button bsStyle="primary" onClick={this.openCreatePostModal}>Create Post</Button>
							</div>
						</Col>
						<Col md={8}>
							<PostList data={this.state.posts} deletePost={this.deletePost} updatePost={this.updatePost} uimageurl={this.props.user.imageurl} convertDate={this.convertDate} />							
						</Col>
					</Row>
				</Grid>

				<Modal show={this.state.showCreatePostModal} onHide={this.closeCreatePostModal}>
					<Modal.Header closeButton>
						<Modal.Title>Create Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form name="createPostForm">
							<FormGroup controlId="CreatePostTitle">
								<FormControl 
									placeholder="Title"
									name="title"
									value={this.state.title}
				          onChange={this.onChangeCreatePostTitle}
								>
								</FormControl>
							</FormGroup>

							<FormGroup controlId="CreatePostTextarea">
				        <FormControl 
				          componentClass="textarea" 
				          placeholder="Write your post here"
				          name="body"
				          value={this.state.body}
				          onChange={this.onChangeCreatePostBody}
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