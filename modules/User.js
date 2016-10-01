import React from 'react'
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'

export default React.createClass({
  getInitialState: function() {
    return { 
      user: []
    };
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

  onChangeUpdateUserFirstname: function(e) {
    this.state.user.firstname = e.target.value;
    this.forceUpdate();
  },

  onChangeUpdateUserLastname: function(e) {
    this.state.user.lastname = e.target.value;
    this.forceUpdate();
  },

  onChangeUpdateUserEmail: function(e) {
    this.state.user.email = e.target.value;
    this.forceUpdate();
  },

  onChangeUpdateUserBio: function(e) {
    this.state.user.bio = e.target.value;
    this.forceUpdate();
  },

  handleUserUpdateSubmit: function(e) {
    e.preventDefault(); 
    var form = document.forms.userUpdateForm;
    this.updateUser({firstname: form.firstname.value, lastname: form.lastname.value, email: form.email.value, imageurl: this.state.user.imageurl, bio: form.bio.value});
    location.reload(false);
  },

  updateUser: function(user) {
    console.log("In updateUser");
    fetch('/api/users', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify(user)
    }).then(response => 
      response.json()
    ).then(data => {  
      this.setState({ user: data });
    }).catch(err => {
      console.log('Error updating User', err)
    });
  },

  render: function() {
    return(
    	<div className="UserUpdate">
    		<Grid>
    			<Row>
    				<Col md={4}>
              <img className="HomeProfileImg" src={this.state.user.imageurl} alt="User picture" height="60" width="60" />
              <form name="userUpdateForm" className="userUpdateForm">
                <FormGroup controlId="userUpdateFirstname">
                  <ControlLabel>
                    Firstname:
                  </ControlLabel>
                  <FormControl 
                    placeholder="Firstname"
                    name="firstname"
                    value={this.state.user.firstname}
                    onChange={this.onChangeUpdateUserFirstname}
                  >
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="userUpdateLastname">
                  <ControlLabel>
                    Lastname:
                  </ControlLabel>
                  <FormControl 
                    placeholder="Lastname"
                    name="lastname"
                    value={this.state.user.lastname}
                    onChange={this.onChangeUpdateUserLastname}
                  >
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="userUpdateEmail">
                  <ControlLabel>
                    Email:
                  </ControlLabel>
                  <FormControl 
                    placeholder="Email"
                    name="email"
                    value={this.state.user.email}
                    onChange={this.onChangeUpdateUserEmail}
                  >
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="userUpdateBio">
                  <ControlLabel>
                    Bio:
                  </ControlLabel>
                  <FormControl 
                    componentClass="textarea" 
                    placeholder="Bio"
                    name="bio"
                    value={this.state.user.bio}
                    onChange={this.onChangeUpdateUserBio}
                  >
                  </FormControl>
                </FormGroup>
                
                <Button bsStyle="success" type="submit" onClick={this.handleUserUpdateSubmit}>
                  Update Profile
                </Button>
              </form>  
    				</Col>
    			</Row>
    		</Grid>
    	</div>
    )
  }
})
