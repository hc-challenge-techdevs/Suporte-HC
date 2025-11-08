import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaSun, FaMoon, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useTheme } from "../ThemeContext/useTheme";
import type { UsuarioTO } from "../../types/api";


const getInitialUser = (): UsuarioTO | null => {
  if (typeof window !== "undefined") {
    const usuarioJSON = localStorage.getItem("session_user_data");
    if (usuarioJSON) {
      return JSON.parse(usuarioJSON) as UsuarioTO;
    }
  }
  return null;
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioTO | null>(getInitialUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setUsuarioLogado(getInitialUser());
  }, [location.pathname]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDark]);

  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSize = localStorage.getItem("fontSize");
      return savedSize ? parseInt(savedSize, 10) : 16;
    }
    return 16;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  const handleLogout = () => {
    localStorage.removeItem("session_user_data");
    setUsuarioLogado(null);
    setIsOpen(false);
    navigate("/login");
  };

  const increaseFontSize = () => {
    setFontSize((currentSize) => Math.min(currentSize + 2, 20));
  };

  const decreaseFontSize = () => {
    setFontSize((currentSize) => Math.max(currentSize - 2, 12));
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="menu-container">
      <div className="menu-wrapper-desktop">
        <Link to="/" className="menu-logo" onClick={closeMenu}>
          <img src="/img/logo-hc.png" alt="Logo do HC" />
        </Link>
        <div className="menu-links-nav">
          <Link to="/" className="menu-link" onClick={closeMenu}> Início </Link>
          <Link to="/integrantes" className="menu-link" onClick={closeMenu}> Integrantes </Link>
          <Link to="/faq" className="menu-link" onClick={closeMenu}> FAQ </Link>
          <Link to="/contato" className="menu-link" onClick={closeMenu}> Contato </Link>
          {usuarioLogado && (
            <Link
              to="/usuario"
              className="menu-link menu-link--user"
              onClick={closeMenu}
            >
              Olá, {usuarioLogado.nomeUsuario.split(' ')[0]}
            </Link>
          )}
        </div>
        <div className="menu-actions">
          <button onClick={toggleTheme} className="acc-button" aria-label="Mudar tema">
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={increaseFontSize} aria-label="Aumentar fonte" className="acc-button"><FaSearchPlus /></button>
          <button onClick={decreaseFontSize} aria-label="Diminuir fonte" className="acc-button"><FaSearchMinus /></button>
          {usuarioLogado ? (
            <button onClick={handleLogout} className="acc-button" aria-label="Sair">
              <FaArrowRightFromBracket />
            </button>
          ) : (
            <Link to="/login" className="acc-button" aria-label="Login" onClick={closeMenu}>
              <FaUser />
            </Link>
          )}
        </div>
      </div>
      <div className="menu-wrapper-mobile">
        <Link to="/" className="menu-logo" onClick={closeMenu}>
          <img src="/img/logo-hc.png" alt="Logo do HC" />
        </Link>
        <button onClick={toggleMenu} className="menu-toggle-button" aria-label="Abrir menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div className={`menu-dropdown-mobile ${isOpen ? 'block' : 'hidden'}`}>
        <div className="menu-dropdown-inner">
          <Link to="/" className="menu-link-mobile" onClick={closeMenu}> Início </Link>
          <Link to="/integrantes" className="menu-link-mobile" onClick={closeMenu}> Integrantes </Link>
          <Link to="/faq" className="menu-link-mobile" onClick={closeMenu}> FAQ </Link>
          <Link to="/contato" className="menu-link-mobile" onClick={closeMenu}> Contato </Link>
          <hr className="menu-divider" />
          {usuarioLogado ? (
            <>
              <Link
                to="/usuario"
                className="menu-link-mobile menu-link-mobile--user"
                onClick={closeMenu}
              >
                Olá, {usuarioLogado.nomeUsuario.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="menu-link-mobile menu-link-mobile--logout"
              >
                <FaArrowRightFromBracket />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="menu-link-mobile menu-link-mobile--login"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
          <hr className="menu-divider" />
          <div className="menu-acc-mobile-header">
            <button onClick={toggleTheme} className="acc-button" aria-label="Mudar tema">
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
            <div className="menu-acc-mobile-buttons">
              <button onClick={increaseFontSize} aria-label="Aumentar fonte" className="acc-button-mobile-small"><FaSearchPlus /></button>
              <button onClick={decreaseFontSize} aria-label="Diminuir fonte" className="acc-button-mobile-small"><FaSearchMinus /></button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}