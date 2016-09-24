import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import Browse from './modules/Browse'
import Login from './modules/Login'
import Home from './modules/Home'

const NoMatch = () => <h2>No match to the route</h2>;

render((
  <Router history={browserHistory}>
    <Route path="/:userId" component={App}>
    	<IndexRoute component={Home}/>
    	<Route path="/:userId/browse" component={Browse}/>
    	<Route path="/:userId/about" component={About}/>
    </Route>
    <Route path="*" component={Login} />
  </Router>
), document.getElementById('app'))
