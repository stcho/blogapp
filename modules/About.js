import React from 'react'
import { Grid, Row, Col} from 'react-bootstrap'

export default React.createClass({
  render() {
    return(
    	<div>
    		<Grid>
    			<Row>
    				<Col md={12}>
    					<p><strong>BlogApp</strong> is a complete blogging application made with React, Express, Node, MongoDB, Webpack, React-Router, React-Bootstrap, and Google Sign-In</p>
    					<p><strong>Created By:</strong> Thomas Cho</p>
    					<p><strong>Repository:</strong> <a href="https://github.com/stcho/blogapp">https://github.com/stcho/blogapp</a></p>
    				</Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
