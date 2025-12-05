import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";

import NavBar from "../components/NavBar";
import FooterPage from "../components/FooterPage";
import Training from "../components/Training";
import Contact from "../sreens/Contact";





function AppRoute() {


  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element ={<HomePage />}/>
        <Route path ="/training" element ={<Training/>}/>
        <Route path="/contact" element ={<Contact/>}/>
      
      
      </Routes>
      <FooterPage/>
    </Router>
  );
}

export default AppRoute;
