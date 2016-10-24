import React from 'react';

import Post from './Post'

export default React.createClass({
	render: function() {
		var deletePost = this.props.deletePost;
		var updatePost = this.props.updatePost;
		var uimageurl = this.props.uimageurl;
		var convertDate = this.props.convertDate;
		var signedinuser = this.props.signedinuser;
		var postNodes = this.props.data.map(function(post) {
			return (
				<Post key={post._id} convertDate={convertDate} signedinuser={signedinuser}uimageurl={uimageurl} updatePost={updatePost} deletePost={deletePost} id={post._id} title={post.title} body={post.body} timecreated={post.timecreated} username={post.username}></Post>
			);
		});
		return (
			<div> 
        {postNodes}
      </div>
		);
	}
})