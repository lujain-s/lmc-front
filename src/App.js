import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import 'jquery/dist/jquery.min.js';
import 'react-slideshow-image/dist/styles.css'

import Sidebar from './components/sidebar/Sidebar.js';
import Navbar from './components/navbar/Navbar.js';
import Home from './components/home/Home.js';
import AutherizedAdmin from "./layouts/Admin.js";
import "./app.css";
import "./styles/cardStyle.css";
import Operations from "./components/back_component/Operations.js";
import Guest from "./layouts/Guest.js";
function App() {
  const { getUser } = Operations();


  useEffect(() => {
    if (getUser() != null) {
      console.log(getUser());
    }
  }, [renderElement]);



  function renderElement() {
    if (!getUser()) {
      return (<Guest />)
    }
    else {
      if (getUser().type == 'admin')
        return (<AutherizedAdmin />);
      else
        return (<AutherizedAdmin />);
    }
  }


  return <div className="d-flex">
    <div className="content-container flex-grow-1">
      {renderElement()}
    </div>

  </div>


}

export default App;
