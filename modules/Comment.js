import React from 'react';
import { Link } from 'react-router'

export default React.createClass({
	handleDeleteComment: function() {
		this.props.deleteComment(this.props.id);
	},

	render: function() {
		var profilePath = '#';
		return (
			<div className="Comment">
				<img className="CommentImg" src={this.props.imageurl} alt="Commenter picture" height="30" width="30" />
				<div className="CommentBody">
					<a href={profilePath}>{this.props.username}</a> {this.props.body}
					<span className="CommentDelete" onClick={this.handleDeleteComment}>x</span>
				</div>
				<div className="CommentTimeCreated">
					{this.props.timecreated}
				</div>
			</div>
		)
	}
})