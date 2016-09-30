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
        <div className="PostDate">
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
      posts: []
    };
  },

  componentDidMount: function() {
    console.log("Params Id", this.props.params.userId);
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

  render: function() {
    return(
    	<div>
    		<Grid>
    			<Row>
    				<Col md={12}>
    					<p>This is the user profile</p>
              <PostList data={this.state.posts} />
    				</Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
