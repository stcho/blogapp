import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

//global array for all of the posts
// var allPosts;

var Post = React.createClass({
	handleDelete: function(e) {
		e.preventDefault();
		this.props.deletePost(this.props.id);
	},

	render: function() {
		return (
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
				<div className="PostBody">
					{this.props.body}
				</div>
			</div>
		);
	}
});

var PostList = React.createClass({
	render: function() {
		var deletePost = this.props.deletePost;
		var postNodes = this.props.data.map(function(post) {
			return (
				<Post key={post._id} deletePost={deletePost} id={post._id} title={post.title} body={post.body} timecreated={post.timecreated} ></Post>
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
		this.createPost({title: form.title.value, body: form.body.value, timecreated: this.convertDate(newDate)});
		this.setState({ title: '' });
		this.setState({ body: '' });
		//close modal
		this.close();
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
			//find specific post with id in the array of all posts and delete it
			function findDeletedPost(post) {
				return post._id == id;;
			}
			var postsArray = this.state.posts;
			var indexToSplice = this.state.posts.findIndex(findDeletedPost)
			postsArray.splice(indexToSplice, 1);
			var modifiedPostsArray = postsArray;
			console.log("Modified post array", modifiedPostsArray);
			this.setState({ posts: modifiedPostsArray });
		}
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
							<PostList data={this.state.posts} deletePost={this.deletePost} />							
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