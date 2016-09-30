import React from 'react'
import { Grid, Row, Col} from 'react-bootstrap'

export default React.createClass({
  render() {
    return(
    	<div>
    		<Grid>
    			<Row>
    				<Col md={12}>
    					<p>This is the User Edit page</p>
    				</Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
