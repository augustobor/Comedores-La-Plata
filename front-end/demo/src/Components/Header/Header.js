import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import { FaUser } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [isLoading, setIsLoading] = useState(true);

  // Valida el token solo cuando el componente se monta o el jwt cambia
  useEffect(() => {
    const validateToken = async () => {
      if (jwt) {
        const isValid = await isTokenValid(jwt, () => setJwt(""));
        setTokenIsValid(isValid); // Actualiza el estado con la validación
      } else {
        setTokenIsValid(false); // Si no hay JWT, el token es inválido
      }
      setIsLoading(false);
    };

    validateToken(); // Llama a la función para validar el token
  }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (!isMenuOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden'; // Deshabilita el scroll si abres el menú en pantallas pequeñas
    } else if (isMenuOpen) {
      document.body.style.overflow = 'auto'; // Habilita el scroll cuando el menú esté cerrado
    }
  };
  

  // Efecto para cerrar el menú cuando la pantalla es mayor a 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        if (isMenuOpen) {
          if (window.innerWidth > 768) {
            document.body.style.overflow = 'auto'; // Habilita el scroll cuando el menú esté cerrado
          }
          setIsMenuOpen(false);
        }
        if (isAdminMenuOpen) setIsAdminMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen, isAdminMenuOpen]);

  const openAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const logOut = () => {
    setJwt("");
    navigate('/');
  };

  const adminMenuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tokenIsValid &&
        isAdminMenuOpen &&
        adminMenuRef.current && 
        !adminMenuRef.current.contains(event.target) &&   // Si el clic es fuera del menú
        !buttonRef.current.contains(event.target)         // Si el clic es fuera del botón
      ) {
        setIsAdminMenuOpen(false);  // Cerrar el menú
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tokenIsValid, isAdminMenuOpen]);  // Asegúrate de incluir isAdminMenuOpen

  return (
    <header className="header">
      <h1 className="header-title">
        <a href={tokenIsValid ? '/AdminPerfil' : '/'} className='header-title-link'>
        Comedores La Plata
        </a>
      </h1>
      <nav className="header-nav">
        <button className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`header-nav-ul ${isMenuOpen ? "active" : ""}`}>

          {!tokenIsValid && (
          <li className={`header-nav-ul-li`}><a href="/" className={`header-nav-button ${location.pathname.endsWith("/") ? "active" : ""}`}>Inicio</a></li>
          )}
          
          {!tokenIsValid && (
          <li className={`header-nav-ul-li`}><a href="/QuienesSomos" className={`header-nav-button ${location.pathname.endsWith("/QuienesSomos") ? "active" : ""}`}>Quiénes Somos</a></li>
          )}

          <li className={`header-nav-ul-li`}><a href="/Mapa" className={`header-nav-button ${location.pathname.endsWith("/Mapa") ? "active" : ""}`}>Mapa</a></li>
          <li className={`header-nav-ul-li`}><a href="/Noticias" className={`header-nav-button ${location.pathname.endsWith("/Noticias") ? "active" : ""}`}>Noticias</a></li>
          
          {tokenIsValid && (
            <li className="header-nav-ul-li">
              <div
                className={`header-nav-button header-nav-admin-button ${isAdminMenuOpen ? "active" : ""}`}
                style={{ fontSize: '1rem' }}
                onClick={openAdminMenu}
                ref={buttonRef}
              >
                <FaUser />
              </div>
              {isAdminMenuOpen && (
                <ul className={`admin-menu-ul ${isAdminMenuOpen ? "active" : ""}`} ref={adminMenuRef}>
                  <li className={`admin-menu-ul-li ${isAdminMenuOpen ? "active" : ""}`}><a href="/AdminPerfil" className="admin-menu-button">Perfil</a></li>
                  <li className={`admin-menu-ul-li ${isAdminMenuOpen ? "active" : ""}`}><a href="/AdminLista" className="admin-menu-button">Lista Admin</a></li>
                  <li className={`admin-menu-ul-li ${isAdminMenuOpen ? "active" : ""}`}><div onClick={logOut} className="admin-menu-button" >Cerrar sesión</div></li>
                </ul>
              )}
            </li>
          )}
          
        </ul>
      </nav>
    </header>
  );
};

export default Header;
