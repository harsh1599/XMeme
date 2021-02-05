import React, { Component } from 'react';
import CreateMemeComponent from './components/CreateMemeComponent'
import MemeListComponent from './components/MemeListComponent'
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
            <CreateMemeComponent />
            <MemeListComponent />
          </div>
        </Route>
        <Route path="/:id" component={ViewMemeComponent} />
      </Router>
    );
  }
}

export default App;
