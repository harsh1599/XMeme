import React, { Component } from 'react';
import CreateMemeComponent from './components/CreateMemeComponent'
import MemeListComponent from './components/MemeListComponent'
import NavbarComponent from  './components/NavbarComponent'
import 'bootstrap/dist/css/bootstrap.css'
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import ViewMemeComponent from './components/ViewMemeComponent';


class App extends Component {
  render() {
    return (
      <Router>
          <Route exact path="/">
            <div className="container">
              <ul class="list-group">
                <li class="list-group-item"><CreateMemeComponent /></li>
                <li class="list-group-item"><MemeListComponent /></li>
              </ul>
            </div>
          </Route>
          <Route path="/:id" component={ViewMemeComponent} />
        </Router>
    );
  }
}

export default App;
