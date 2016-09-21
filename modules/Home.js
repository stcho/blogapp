import React from 'react'

export default React.createClass({
	render: function() {
		return (
			<div>
				<h2>{this.props.params.userId}</h2>
			</div>
		)
	}
})