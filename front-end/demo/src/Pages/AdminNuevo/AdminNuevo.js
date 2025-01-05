import React, { useState, useEffect } from 'react'
import "./AdminNuevo.css";
import { Link, useNavigate } from 'react-router-dom';
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode


const API_URL = process.env.API_URL || 'http://localhost:4000';


const AdminNuevo = ({ id }) => {

  const superAdmin = process.env.REACT_APP_SUPER_ADMIN;

  const navigate = useNavigate();

  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [editingUser, setEditingUser] = useState(null); // Estado para almacenar la validación del token

  // Validación del token
  const validateToken = async () => {
    if (jwt) {
      const isValid = await isTokenValid(jwt, () => setJwt(""));
      if(isValid) {
        setTokenIsValid(isValid); // Actualiza el estado con la validación
        const decodedToken = jwtDecode(jwt); // Decodificar el JWT para obtener el ID
        const username = decodedToken.sub;
        if(username !== superAdmin)  navigate("/");
      } else {
        navigate("/InicioSesion");
      }
    } else {
      setTokenIsValid(false); // Si no hay JWT, el token es inválido
      navigate("/");
    }
  };

  useEffect(() => {
    validateToken(); // Llama a la función para validar el token
  }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  useEffect(() => {
    
    validateToken(); // Llama a la función para validar el token
  }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  const editing = !!id;

  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    apellido: "",
    mail: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleSubmit(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const url = editing ? `${API_URL}/usuario/${id}` : `${API_URL}/usuario/`;  // Determina si es una actualización o creación
    const method = editing ? "PUT" : "POST";  // Usa PUT para actualizar y POST para crear

    // Crear un objeto FormData
    const formDataToSend = new FormData();

    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("apellido", formData.apellido);
    formDataToSend.append("mail", formData.mail);

    // Realizar la solicitud al backend como multipart/form-data
    fetch(url, {
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
        method: method,
        body: formDataToSend,
    })
    .then(async (response) => {
        if (response.ok) {
            window.location.href = "/AdminLista"; // Redirige si es necesario
        } else {
            // Leer el cuerpo de la respuesta para obtener el mensaje de error
            const errorData = await response.json();
            console.error("Error al crear el usuario:", errorData.message || "Error desconocido");
            // alert("Error: " + (errorData.message || "Error desconocido"));
        }
    })
    .catch((error) => {
        console.error("Error al realizar la solicitud:", error.message);
        // alert("Ocurrió un error al crear el usuario: " + error.message);
    });
  }


  useEffect(() => {
    if (id) {
        fetch(`${API_URL}/usuario/edit/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data");
            }
        })
        .then(data => {
            setEditingUser(data);
            setFormData({
              username: data.username,
              nombre: data.nombre,
              apellido: data.apellido,
              mail: data.mail,
              password: '' // Consider not setting the password directly for security reasons
            });
        })
        .catch(error => console.error("Error fetching data:", error));
    }
}, [id]);

    return (
      <div className="fondito-usuario-nuevo">
        <div className="usuario-container">
          <p className='centro-details-separador'/>
          <h2 className="usuario-h2">Formulario para Nuevo Admin</h2>
          <p className='centro-details-separador'/>
          <form className="usuario-form" onSubmit={handleSubmit}>
            <div className="usuario-form-group">
              <label className="usuario-label" htmlFor="username">Nombre de usuario:</label>
              <input
                className="usuario-input"
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                required
                // value={editingUser != null && editingUser.username ? editingUser.username : ""}
                value={formData.username}
              />
            </div>
            <div className="usuario-form-group">
              <label className="usuario-label" htmlFor="password">Contraseña:</label>
              <input
                className="usuario-input"
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                required={!editing}
                // value={editingUser != null && editingUser.password ? editingUser.password : ""}
                value={formData.password}
                placeholder={editing ? 'Dejar este campo vacío hace que se mantenga la contraseña anterior' : ''}
              />
            </div>
            <p className='centro-details-separador'/>
            <div className="usuario-form-group">
              <label className="usuario-label" htmlFor="nombre">Nombre:</label>
              <input
                className="usuario-input"
                type="text"
                id="nombre"
                name="nombre"
                onChange={handleChange}
                required
                // value={editingUser != null && editingUser.nombre ? editingUser.nombre : ""}
                value={formData.nombre}
              />
            </div>
            <div className="usuario-form-group">
              <label className="usuario-label" htmlFor="apellido">Apellido:</label>
              <input
                className="usuario-input"
                type="text"
                id="apellido"
                name="apellido"
                onChange={handleChange}
                required
                // value={editingUser != null && editingUser.apellido ? editingUser.apellido : ""}
                value={formData.apellido}
              />
            </div>
            <div className="usuario-form-group">
              <label className="usuario-label" htmlFor="mail">Email:</label>
              <input
                className="usuario-input"
                type="email"
                id="mail"
                name="mail"
                onChange={handleChange}
                required
                // value={editingUser != null && editingUser.mail ? editingUser.mail : ""}
                value={formData.mail}
              />
            </div>
            <div className="usuario-button-group">

            <Link to="/AdminLista" className="usuario-buttons cancel-button">
              Volver
            </Link>
          
            <button className="usuario-buttons guardar-button" type="submit">
              {editing ? ("Actualizar") : ("Crear Admin")}
            </button>
          
        </div>
      </form>
    </div>
  </div>
  );
};

export default AdminNuevo
