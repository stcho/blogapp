import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import UserBox from './modules/UserBox'

render((
  <Router history={browserHistory}>
    <Route path="/" component={UserBox} />
    <Route path="/about" component={About}/>
  </Router>
), document.getElementById('app'))
