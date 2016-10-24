import React from 'react'
import { Grid, Row, Col} from 'react-bootstrap'

import CommentList from './CommentList'

var Post = React.createClass({
  getInitialState: function() {
    return {
      comments: []
    }
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
      var modifiedComments = this.state.comments.concat(dataArray);
      this.setState({ comments: modifiedComments });
    }).catch(err => {
      console.log('Error creating comment', err)
    });
  },

  deleteComment: function(id) {
    var confirmation = confirm('Are you sure you want to delete this comment?');
    if (confirmation === true) {
      fetch('/api/comments/'+id, {
        method: 'DELETE',
        credentials: 'include'
      }).catch(err => {
        console.log('Error deleting comment', err)
      });
      //find specific comment with id in this.state.comments and delete it
      function findDeletedComment(comment) {
        return comment._id == id;;
      }
      var commentsArray = this.state.comments;
      var indexToSplice = this.state.comments.findIndex(findDeletedComment)
      commentsArray.splice(indexToSplice, 1);
      this.setState({ comments: commentsArray });
    }
  },

  handleDelete: function(e) {
    e.preventDefault();
    this.props.deletePost(this.props.id);
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

  render: function() {
    return (
      <div className="PostBox">
        <div className="PostTitle">
          {this.props.title}
        </div>
        <div className="PostTimeCreated">
          {this.props.timecreated}
        </div>
        <div className="PostBody">
          {this.props.body}
        </div>
        <CommentList data={this.state.comments} createComment={this.createComment} deleteComment={this.deleteComment} signedinuser={this.props.signedinuser} uimageurl={this.props.signedinuser.imageurl} convertDate={this.convertDate} postid={this.props.id} username={this.props.signedinuser.firstname + " " + this.props.signedinuser.lastname} />
      </div>
    );
  }
});


var PostList = React.createClass({
  render: function() {
    var signedinuser = this.props.signedinuser;
    var postNodes = this.props.data.map(function(post) {
      return (
        <Post key={post._id} signedinuser={signedinuser} id={post._id} title={post.title} body={post.body} timecreated={post.timecreated} ></Post>
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
      user: [],
      signedinuser: [],
      posts: []
    };
  },

  componentDidMount: function() {
    this.loadUser();
    this.loadSignedInUser();
    this.loadPosts();
  },

  loadSignedInUser: function() {
    fetch('/api/signedinuser/', {credentials: 'include'}).then(response =>
      response.json()   
    ).then(data => {
      this.setState({signedinuser: data});
    }).catch(err => {
      console.log(err);
    });
  },

  loadPosts: function() {
    fetch('/api/posts/'+this.props.params.userId, {credentials: 'include'}).then(response =>
      response.json()
    ).then(data => {
      var flipData = data.reverse()
      this.setState({ posts: data });
    }).catch(err => {
      console.log(err);
    });
  },

  loadUser: function() {
    fetch('/api/users/'+this.props.params.userId, {credentials: 'include'}).then(response =>
      response.json()   
    ).then(data => {
      this.setState({user: data});
    }).catch(err => {
      console.log(err);
    });
  },

  render: function() {
    return(
    	<div>
    		<Grid>
    			<Row>
            <Col md={3}>
              <img className="HomeProfileImg" src={this.state.user.imageurl} alt="User picture" height="60" width="60" />
              <span className="HomeProfileName"> {this.state.user.firstname} {this.state.user.lastname}</span> 
              <div className="HomeProfileBio">{this.state.user.bio}</div>
            </Col>
            <Col md={8}>
              <PostList data={this.state.posts} signedinuser={this.state.signedinuser}/>
            </Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
