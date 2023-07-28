import './App.css';
import { Col, Row, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import React, { useState } from 'react'
import {HashRouter, Routes, Route, Link, Navigate, useNavigate} from "react-router-dom"
import { Import } from './Components/Import';
import Home from './Components/Home';


function App() {
  
  return (
    <div className="App">
      <HashRouter>
      <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/Home" style={{color:'white'}}>Optimizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Home" style={{color:'gray'}}>Search</Nav.Link>
            <Nav.Link as={Link} to="/Import" style={{color:'gray'}}>Import Playlist</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Routes>
    <Route path="/Home" element={<Home/>}/>
    <Route path="/Import" element={<Import/>} />
    <Route path="/*" element={<Navigate to="/Home" />} />
  </Routes>
  </HashRouter>  
    </div>
  );
}

export default App;
