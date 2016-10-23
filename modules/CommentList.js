import React from 'react';

import Comment from './Comment'

export default React.createClass({
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
		var deleteComment = this.props.deleteComment;
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment key={comment._id} deleteComment={deleteComment} id={comment._id} imageurl={comment.imageurl} username={comment.username} body={comment.body} timecreated={comment.timecreated}></Comment>
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
})