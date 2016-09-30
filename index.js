import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import Browse from './modules/Browse'
import Login from './modules/Login'
import Profile from './modules/Profile'
import User from './modules/User'

const NoMatch = () => <h2>No match to the route</h2>;

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login} />
    <Route path="/u/:userId" component={App}>
    	<Route path="/u/:userId/browse" component={Browse}/>
    	<Route path="/u/:userId/about" component={About}/>
    	<Route path="/profile/:userId" component={Profile}/>
    	<Route path="/u/:userId/user" component={User}/>
    </Route>
    <Route path="/*" component={NoMatch} />
  </Router>
), document.getElementById('app'))
