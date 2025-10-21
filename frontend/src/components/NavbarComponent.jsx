import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaHome, FaThList, FaImage } from "react-icons/fa";

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="bg-body-tertiary shadow-sm py-2"
      sticky="top"
    >
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-primary">
          <FaImage className="me-2 text-primary" />
          GalleryApp
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              onClick={handleNavClick}
              className={({ isActive }) =>
                isActive ? "fw-semibold text-primary" : ""
              }
            >
              <FaHome className="me-1" /> Home
            </Nav.Link>

            <NavDropdown title="Master" id="nav-dropdown" menuVariant="light">
              <NavDropdown.Item as={NavLink} to="/products" onClick={handleNavClick}>
                <FaThList className="me-2" /> Products
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/categories" onClick={handleNavClick}>
                Categories
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/users" onClick={handleNavClick}>
                Users
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Right Section (Optional) */}
          <Nav>
            <Nav.Link
              as={NavLink}
              to="/about"
              onClick={handleNavClick}
              className={({ isActive }) =>
                isActive ? "fw-semibold text-primary" : ""
              }
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
