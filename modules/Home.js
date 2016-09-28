import React from 'react';
import { Grid, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

var Post = React.createClass({
	deletePost: function() {
		var confirmation = confirm('Are you sure you want to delete this post?');
		if (confirmation === true) {
			fetch('/api/posts/'+this.props.id, {
				method: 'DELETE',
				credentials: 'include'
			}).catch(err => {
				console.log('Error deleting user', err)
			});
			//find post in this.state.posts array with this.props.id and delete it
			// function findDeletedPost(post) {
			// 	return post._id == this.props.id
			// }
			// console.log("Find Deleted post in state:", this.props.data.find(findDeletedPost));

			// var dataArray = [data];
			// var modifiedPosts = dataArray.concat(this.state.posts);
			// this.setState({ posts: modifiedPosts });
		}
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
					<Button onClick={this.deletePost}>x</Button>
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
		var postNodes = this.props.data.map(function(post) {
			return (
				<Post key={post._id} id={post._id} title={post.title} body={post.body} timecreated={post.timecreated} ></Post>
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

	onChangeCreatePostTextarea: function(e) {
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
		form.title.value = '';
		form.body.value = '';
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
							<PostList data={this.state.posts} />							
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