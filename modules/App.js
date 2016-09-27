import React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

import Home from './Home'

export default React.createClass({
  getInitialState: function() {
		return { user: [] };
	},

	componentDidMount: function() {
		this.loadSignedInUser();
	},

	loadSignedInUser: function() {
		fetch('/api/signedinuser/', {credentials: 'include'}).then(response =>
			response.json()		
		).then(data => {
			this.setState({user: data});
		}).catch(err => {
			console.log(err);
		});
	},

  render: function() {
    var homePath = "/u/" + this.state.user._id;
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
        {this.props.children || <Home user={this.state.user}/>}
      </div>
    )
  }
})
