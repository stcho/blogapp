import React from 'react'
import { Button } from 'react-bootstrap'

export default React.createClass({
	render: function() {
		return (
			<div>
				<Button bsStyle="primary">Default button</Button>
				<h2>{this.props.params.userId}</h2>
			</div>
		)
	}
})