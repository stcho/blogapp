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
    var homePath = "/" + this.props.params.userId;
    var aboutPath = homePath + "/about";
    var browsePath = homePath + "/browse";
    return (
      <div>
        <Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href={homePath}>BlogApp</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem href={browsePath}>Browse</NavItem>
						<NavItem href={aboutPath}>About</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem href="#"><img className="HomeNavImg" src={this.state.user.imageurl} alt="User picture" height="25" width="25" /> {this.state.user.firstname}</NavItem>
					</Nav>
				</Navbar>
        {this.props.children}
      </div>
    )
  }
})
