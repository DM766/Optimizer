import './App.css';
import {Container, Nav, Navbar} from 'react-bootstrap';
import React from 'react'
import {HashRouter, Routes, Route, Link, Navigate} from "react-router-dom"
import { Import } from './Components/Import';
import Home from './Components/Home';
import {Credits} from './Components/Credits'

function App() {
  return (
    <div className="App">
      <HashRouter>
      <Navbar  expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/Home" style={{color:'white'}}>Optimizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <Nav.Link as={Link} to="/Home" style={{color:'gray'}}>Search</Nav.Link>
            <Nav.Link as={Link} to="/Import" style={{color:'gray'}}>Import Playlist</Nav.Link>
            <Nav.Link as={Link} className="dynamicNav" to="/Credits" style={{color:'gray'}}>Credits</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Routes>
    <Route path="/Home" element={<Home/>}/>
    <Route path="/Import" element={<Import/>}/>
    <Route path="/Credits" element={<Credits/>}/> 
    <Route path="/*" element={<Navigate to="/Home" />} />
  </Routes>
  </HashRouter>
    </div>
  );
}

export default App;
