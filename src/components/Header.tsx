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
import SearchAutoComplete from "./SearchAutoComplete";
import "./header.css"

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const navigate = useNavigate(); // Now navigate can be used

    const logoutUser = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userType");
        navigate("/login"); // Redirect to login after logging out
    };

    return (
        <div>
            <Navbar expand="md">
                <NavbarBrand href="/">Smart Homes</NavbarBrand>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-auto" navbar>
                        {/* Add SearchAutoComplete to the header */}
                        <div className="search-bar">
                            <SearchAutoComplete/>
                        </div>
                        {userType === "admin" ? (
                            <NavItem>
                                <NavLink href="/stats/">Statistics</NavLink>
                            </NavItem>
                        ) : (
                            <></>
                        )}
                        {
                            userType === "sales_man" ? <NavItem>
                                    <NavLink href="/inventory-report">Inventory Report</NavLink>
                                </NavItem>
                                : <></>
                        }
                        {
                            userType === "sales_man" ? <NavItem>
                                    <NavLink href="/sales-report">Sales Report</NavLink>
                                </NavItem>
                                : <></>
                        }
                        <NavItem>
                            <NavLink href="/products/top-rated">Top Rated</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/products/trending">Trending</NavLink>
                        </NavItem>
                        {userType === "admin" ? (
                            <NavItem>
                                <NavLink href="/addproduct/">Add Product</NavLink>
                            </NavItem>
                        ) : (
                            <></>
                        )}
                        {userType === "admin" ? (
                            <NavItem>
                                <NavLink href="/addaccessory/">Add Accessory</NavLink>
                            </NavItem>
                        ) : (
                            <NavItem>
                                <NavLink href="/cart/">Cart</NavLink>
                            </NavItem>
                        )}
                        {token ? (
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Hello {username}
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <NavLink href="/orders">Orders</NavLink>
                                    <DropdownItem divider/>
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
