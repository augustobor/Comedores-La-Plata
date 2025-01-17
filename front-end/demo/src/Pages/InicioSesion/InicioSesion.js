import React, { useEffect, useState } from 'react';
import "./InicioSesion.css";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import { FaExclamationCircle } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const InicioSesion = () => {

  const [jwt, setJwt] = useLocalState("", "jwt");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const attemptLoginRequest = () => {
    //validaciones...

    sendLoginRequest();

  }

  useEffect(() => {
    if (jwt && isTokenValid(jwt, () => setJwt(""))) {
      navigate("/");
    }
  }, []);

  const [localErrors, setLocalErrors] = useState({});

  const validateInicioSesion = () => {
    let valid = true;
    let errors = {}; // Creamos un nuevo objeto para errores

    // Validar nombre de usuario
    if (!username) {
      errors["username"] = "Este campo es obligatorio.";
      valid = false;
    } else if (username.length < 4) {
      errors["username"] = "El nombre de usuario debe tener al menos 4 caracteres.";
      valid = false;
    }

    // Validar contraseña
    if (!password) {
      errors["password"] = "Este campo es obligatorio.";
      valid = false;
    } else if (password.length < 8) {
      errors["password"] = "La contraseña debe tener al menos 8 caracteres.";
      valid = false;
    }

    setLocalErrors(errors); // Actualizamos el estado de errores

    return valid;
  };


  function sendLoginRequest() {

    if (!validateInicioSesion()) { 
      return;
    }

    const requestBody = {
        "username": username,
        "password": password
    };

    fetch(`${API_URL}/api/auth/login`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (response.status === 200) {
            return Promise.all([response.json(), response.headers]);
        } else {
            return Promise.reject("Invalid login attempt");
        }
    })
    .then(([body]) => {
        if(body) {
          setJwt(body.token);
          window.location.href = "/AdminPerfil";
        } else {
          console.log(body);
        }
    })
    .catch((error) => {
        console.error("Login failed:", error); // Imprime el error en la consola
    });
  }


  const manejarCambioUsuario = (e) => {
    setUsername(e.target.value);
  };
  
  const manejarCambioContraseña = (e) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate("/");
  };
    
  return (
    <div className="fondito">
    <div className="login-container">
      <h2 className='login-h2'>Inicio de Sesión</h2>
      <div className="login-form">
        <div className="login-form-group">
          <label className='login-label' htmlFor="usuario">Usuario:</label>
          <input
            className='login-input'
            type="text"
            id="usuario"
            onChange={manejarCambioUsuario}
            placeholder="Ingresa tu usuario"
            required
          />
          {localErrors.username && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.username}</p>}
        </div>
        <div className="form-group">
          <label className='login-label' htmlFor="contraseña">Contraseña:</label>
          <input
            className='login-input'
            type="password"
            id="contraseña"
            onChange={manejarCambioContraseña}
            placeholder="Ingresa tu contraseña"
            required
          />
          {localErrors.password && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.password}</p>}
        </div>
        <div className="login-button-group">
          <button className="login-buttons login-button" onClick={attemptLoginRequest}>Ingresar</button>
          <button type="button" className="login-buttons cancel-button" onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default InicioSesion
