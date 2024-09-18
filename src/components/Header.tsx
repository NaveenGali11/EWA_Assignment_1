import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from 'reactstrap';

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar expand="md">
                {/* Right-aligned logo and text */}
                <NavbarBrand href="/">
                    Smart Homes
                </NavbarBrand>
                {/* Left-aligned links */}
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Products
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>Smart Door Bells</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Smart Door Locks</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Smart Speakers</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Smart Lighting</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Smart Thermostats</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem>
                            <NavLink href="/login/">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/track/">Track Your Order</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <NavbarToggler onClick={toggle} />
            </Navbar>
        </div>
    );
}

export default Header;
