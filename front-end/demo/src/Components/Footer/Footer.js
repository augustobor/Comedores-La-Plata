import React from 'react'
import { FaLinkedin, FaGithub  } from 'react-icons/fa';
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
        <span className="developer">
        Website made by: Agustín Reategui
       <a href="https://www.linkedin.com/in/agustin-reategui-9b337b234/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
          <FaLinkedin className="linkedin-icon" />
        </a>
        <a href="https://github.com/QueenNixu" target="_blank" rel="noopener noreferrer" className="github-link">
            <FaGithub className="icon" />
          </a>
        </span>
        <span className="developer">
         | Patricio José Corbelleri
        <a href="https://www.linkedin.com/in/patricio-jose-corbelleri-819310219/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
          <FaLinkedin className="linkedin-icon" />
        </a>
        <a href="https://github.com/PatricioCorbelleri" target="_blank" rel="noopener noreferrer" className="github-link">
            <FaGithub className="icon" />
          </a>
        </span>
      <p className='footer-text'>&copy; 2024 Comedores La Plata. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer