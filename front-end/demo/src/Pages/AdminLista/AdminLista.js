import React, { useState, useEffect } from 'react';
import './AdminLista.css';
import { Link, useNavigate } from 'react-router-dom';
import { isTokenValid } from '../../Utils/isTokenValid';
import { useLocalState } from '../../Utils/useLocalStorage';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode
import Modal from '../../Components/modals/modal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const AdminLista = () => {

  const superAdmin = process.env.REACT_APP_SUPER_ADMIN;

  // Estado para almacenar los usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [userUsername, setUserUsername] = useState(null);
  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Estado para almacenar el usuario seleccionado
  const navigate = useNavigate();

  // Validación del token
  const validateToken = async () => {
    if (jwt) {
      const isValid = await isTokenValid(jwt, () => setJwt(""));
      if(isValid) {
        setTokenIsValid(isValid); // Actualiza el estado con la validación
        const decodedToken = jwtDecode(jwt); // Decodificar el JWT para obtener el ID
        setUserUsername(decodedToken.sub); // Asignar el ID del usuario
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

  // Obtener los usuarios
  useEffect(() => {
    if (userUsername !== null) { // Solo hacer el fetch si el ID del usuario está disponible
      fetch(`${API_URL}/usuario/allExceptUsername/${userUsername}`)
        .then((response) => response.json()) // Parsear la respuesta JSON
        .then((data) => {
          setUsuarios(data); // Guardar los datos en el estado
        })
        .catch((error) => {
          console.error('Error al obtener los usuarios:', error); // Manejo de errores
        });
    }
  }, [userUsername]);

  // Eliminar usuario
  const EliminarUsuarioModal = async () => {
    if (usuarioSeleccionado) {
      try {
        const response = await fetch(`${API_URL}/usuario/${usuarioSeleccionado.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
    
        if (!response.ok) {
          cerrarEliminarUsuarioModal(); // Cierra el modal después de la eliminación
          throw new Error('Error al eliminar el usuario');
        }
        const updatedUsuarios = usuarios.filter(usuario => usuario.id !== usuarioSeleccionado.id);
        setUsuarios(updatedUsuarios);
        cerrarEliminarUsuarioModal(); // Cierra el modal después de la eliminación
      } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
      }
    }
  };

  // Abrir modal
  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario); // Establecer el usuario seleccionado
  };

  // Cerrar modal
  const cerrarEliminarUsuarioModal = () => {
    setUsuarioSeleccionado(null); // Limpiar el usuario seleccionado
  };

  return (
    <div className="fondito-lista-usuarios">
      <div className="lista-usuarios-container">
        <h2 className="usuarios-h2">Lista de Usuarios</h2>
        <ul className="usuarios-list">
          {/* Iterar sobre los usuarios obtenidos del backend */}
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="usuario-item">
              <span className="usuario-nombre usuario-data">{usuario.apellido} {usuario.nombre}</span>
              <p className="centro-details-separador"/>
              <span className="usuario-nombre usuario-data">{usuario.username}</span>
              <p className="centro-details-separador"/>
              <span className="usuario-email usuario-data">{usuario.mail}</span>
              {userUsername && jwt && userUsername === superAdmin &&
                <div className='admin-lista-btns'>
                  <button 
                    className="usuario-button-eliminar" 
                    onClick={() => navigate(`/EditarAdmin/${usuario.id}`)}
                  >
                    Editar
                  </button>
                  <button 
                    className="usuario-button-eliminar" 
                    onClick={() => abrirModalEliminar(usuario)} // Pasa el usuario seleccionado
                  >
                    Eliminar
                  </button>
                </div>
              }

              {/* Modal de confirmación */}
              {usuarioSeleccionado && usuarioSeleccionado.id === usuario.id && (
                <Modal
                  question={"¿Estás seguro que quieres eliminar este usuario administrador?"}
                  onCancel={cerrarEliminarUsuarioModal}
                  onAccept={EliminarUsuarioModal}
                  isOpen={true}
                  infoArray={[
                    usuarioSeleccionado.nombre && usuarioSeleccionado.apellido 
                      ? `${usuarioSeleccionado.apellido} ${usuarioSeleccionado.nombre}` : "",
                    usuarioSeleccionado.username ? usuarioSeleccionado.username : "", 
                    usuarioSeleccionado.mail ? usuarioSeleccionado.mail : ""
                  ]}
                />
              )}

            </li>
          ))}
        </ul>
        {userUsername && jwt && userUsername === superAdmin &&
          <div className="usuarios-button-group">
            <Link to="/AdminNuevo" className="usuario-buttons agregar-admin-button">
              Nuevo Admin
            </Link>
          </div>
        }
      </div>
    </div>
  );
};

export default AdminLista;
