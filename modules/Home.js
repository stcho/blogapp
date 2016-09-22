import React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

export default React.createClass({
	getInitialState: function() {
		return { user: [] };
	},

	componentDidMount: function() {
		this.loadUser();
	},

	loadUser: function() {
		fetch('/api/users/' + this.props.params.userId).then(response =>
			response.json()		
		).then(data => {
			this.setState({user: data});
		}).catch(err => {
			console.log(err);
		});
	},

	render: function() {
		return (
			<div>
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">BlogApp</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem href="#">Link1</NavItem>
						<NavItem href="#">Link2</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem href="#">Link3</NavItem>
						<NavItem href="#">Link4</NavItem>
					</Nav>
				</Navbar>
				<h3>FirstName: {this.state.user.firstname}</h3>
				<h3>{this.props.params.userId}</h3>
			</div>
		)
	}
})