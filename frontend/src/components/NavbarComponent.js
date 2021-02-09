import React, { Component } from 'react';

import {Navbar, NavDropdown, F} from 'react-bootstrap'

export default class NavbarComponent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Navbar style={{position: '-webkit-sticky',position: 'sticky'}} bg="light" expand="lg">
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    Something
                </Navbar.Collapse>
            </Navbar>
        );
    }
}