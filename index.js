import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import Browse from './modules/Browse'
import Login from './modules/Login'

const NoMatch = () => <h2>No match to the route</h2>;

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login} />
    <Route path="/u/:userId" component={App}>
    	<Route path="/u/:userId/browse" component={Browse}/>
    	<Route path="/u/:userId/about" component={About}/>
    </Route>
    <Route path="/*" component={NoMatch} />
  </Router>
), document.getElementById('app'))
