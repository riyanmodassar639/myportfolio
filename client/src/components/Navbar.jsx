import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog", isRoute: true },
  { href: "/#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar${scrolled ? " navbar-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <a
          href="#home"
          className={`logo${menuOpen ? " logo-hidden" : ""}`}
          onClick={closeMenu}
        >
          <span className="logo-mark"></span>
          Riyan Modassar
        </a>

        <nav className="nav-links">
          {navItems.map((item) =>
            item.isRoute ? (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            )
          )}
        </nav>

        <nav className={`navbar-mobile${menuOpen ? " open" : ""}`}>
          {navItems.map((item) =>
            item.isRoute ? (
              <Link key={item.href} to={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            )
          )}
        </nav>

        <button
          type="button"
          className={`navbar-burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;