import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown,
} from "reactstrap";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const navigate = useNavigate(); // Now navigate can be used

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userType');
        navigate('/login'); // Redirect to login after logging out
    };

    return (
        <div>
            <Navbar expand="md">
                <NavbarBrand href="/">Smart Homes</NavbarBrand>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Products
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem>Smart Door Bells</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Smart Door Locks</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Smart Speakers</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Smart Lighting</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Smart Thermostats</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        {
                            userType === "admin" ? <NavItem>
                                <NavLink href="/addproduct/">Add Product</NavLink>
                            </NavItem> : <NavItem>
                                <NavLink href="/track/">Track Your Order</NavLink>
                            </NavItem>
                        }
                        {
                            userType === "admin" ? <NavItem>
                                <NavLink href="/addaccessory/">Add Accessory</NavLink>
                            </NavItem> : <></>
                        }
                        {token ? (
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Hello {username}
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem onClick={logoutUser}>Logout</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        ) : (
                            <NavItem>
                                <NavLink href="/login/">Login</NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
                <NavbarToggler onClick={toggle}/>
            </Navbar>
        </div>
    );
}

export default Header;
