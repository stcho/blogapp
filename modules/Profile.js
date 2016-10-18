import React from 'react'
import { Grid, Row, Col} from 'react-bootstrap'

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
        <div className="PostTimeCreated">
          {this.props.timecreated}
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
      user: [],
      posts: []
    };
  },

  componentDidMount: function() {
    this.loadUser();
    this.loadPosts();
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
              <PostList data={this.state.posts} />
            </Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
