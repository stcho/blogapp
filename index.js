import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import Login from './modules/Login'
import Home from './modules/Home'

const NoMatch = () => <h2>No match to the route</h2>;

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login} />
    <Route path="/:userId" component={Home} />
    <Route path="/about" component={About}/>
    <Route path="*" component={NoMatch} />
  </Router>
), document.getElementById('app'))
