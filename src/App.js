import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainPage from './Pages/MainPage';
import ContentPage from './Pages/ContentPage';
import RegistePage from './Pages/RegistePage';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:''
    }
  }

  componentDidMount() {
  }


	render() {
    return (
	    <Router>
		    <div>
			    <Route exact path="/" component={MainPage}/>
			    <Route path="/about/" component={ContentPage}/>
			    <Route path="/registe/" component={RegistePage} />
		    </div>
	    </Router>
    );
  }
}
export default App;