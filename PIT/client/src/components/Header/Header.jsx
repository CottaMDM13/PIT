import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaDoorOpen, FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setMenuOpen(false); 
    navigate("/login"); 
  };

  const handleLoginRedirect = () => {
    setMenuOpen(false); 
    navigate("/login"); 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  return (
    <header className={styles.header}>
      <h1>Meu Restaurante</h1>

      <div className={styles.menuToggle} onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <nav className={`${styles.navbar} ${menuOpen ? styles.navOpen : ""}`}>
        <div className={styles.menuLinks}>
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/products" onClick={toggleMenu}>
          Cardápio 
          </Link>
          <Link to="/cart" onClick={toggleMenu}>
            Carrinho
          </Link>
        </div>
        <div className={styles.accountIcon}>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              title="Sair da Conta"
              className={styles.iconButton}
            >
              <FaDoorOpen size={24} />
            </button>
          ) : (
            <button
              onClick={handleLoginRedirect}
              title="Sair da Conta" 
              className={styles.iconButton}
            >
              <FaUserCircle size={24} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
