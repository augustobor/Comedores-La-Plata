import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminPerfil.css";
import Modal from '../../Components/modals/modal'

import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';

const AdminPerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token
  const [userCentros, setUserCentros] = useState();
  const [userNoticias, setUserNoticias] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!tokenIsValid) {
        return;
      }

      try {
        const response = await fetch('/usuario/self', {
          method: 'GET', // Método de la solicitud
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` // Agrega el token JWT en la cabecera
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const data = await response.json();

        setTimeout(() => {
          setUsuario(data);
        }, 750);

      } catch (error) {
        console.error('Error en el fetch:', error.message);
      }
    };

    fetchUser();
  }, [tokenIsValid, jwt]); // Añadir tokenIsValid y jwt a las dependencias

  useEffect(() => {
    const validateToken = async () => {
      if (jwt) {
        const isValid = await isTokenValid(jwt, () => setJwt(""));
        if(isValid) {
          setTokenIsValid(isValid); // Actualiza el estado con la validación
        } else {
          navigate("/InicioSesion");
        }
      } else {
        setTokenIsValid(false); // Si no hay JWT, el token es inválido
        navigate("/");
      }
    };

    validateToken(); // Llama a la función para validar el token
  }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  useEffect(() => {
    const fetchUserCentros = async () => {
      if (!tokenIsValid) {
        // console.error("Token no es válido");
        return;
      }
  
      try {
        const response = await fetch('/centro/user', {
          method: 'GET', // Método de la solicitud
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` // Agrega el token JWT en la cabecera
          }
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los centros');
        }
        
        const data = await response.json();
        setUserCentros(data);
      } catch (error) {
        console.error('Error en el fetch:', error.message);
      }
    };
  
    fetchUserCentros();
  }, [tokenIsValid, jwt]);

  useEffect(() => {
    const fetchUserNoticias = async () => {
      if (!tokenIsValid) {
        // console.error("Token no es válido");
        return;
      }
  
      try {
        const response = await fetch('/noticia/user', {
          method: 'GET', // Método de la solicitud
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}` // Agrega el token JWT en la cabecera
          }
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los centros');
        }
        
        const data = await response.json();
        setUserNoticias(data);
      } catch (error) {
        console.error('Error en el fetch:', error.message);
      }
    };
  
    fetchUserNoticias();
  }, [tokenIsValid, jwt]);

  const tiposComedorMap = {
    COMEDOR_COMUNITARIO: "Comedor Comunitario",
    MERENDERO: "Merendero",
    COPA_DE_LECHE: "Copa de Leche",
    DISTRIBUIDORA_DE_ALIMENTOS: "Distribuidora de Alimentos",
    CENTRO_DE_PRODUCCION_DE_VIANDAS: "Centro de Producción de Viandas"
  };

  const colorMap = {
    MERENDERO: '#A52A2A',                // Bordo
    COMEDOR_COMUNITARIO: '#006400',      // Verde oscuro
    COPA_DE_LECHE: '#3357FF',            // Azul vibrante
    DISTRIBUIDORA_DE_ALIMENTOS: '#800080', // Púrpura intenso
    CENTRO_DE_PRODUCCION_DE_VIANDAS: '#FF9900', // Naranja cálido
    default: '#FBBC04'                   // Color de fondo predeterminado
  };

  const prioridadColorMap = {
    Urgente: '#FF0000', // Rojo
    Importante: '#008000', // Verde
    Informativa: '#000000', // Gris suave
    default: '#000000' // Negro (por si la prioridad no coincide con ninguna clave)
  };

  const [modalEliminarCentroOpen, setModalEliminarCentroOpen] = useState(false);
  const [modalEliminarNoticiaOpen, setModalEliminarNoticiaOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  
  const abrirModalEliminarCentro = (id) => {
    const centroEncontrado = userCentros.find((centro) => centro.id === id);
    setSelectedCentro(centroEncontrado || null);
    setModalEliminarCentroOpen(true); // Trigger modal closing animation
  };

  const abrirModalEliminarNoticia = (id) => {
    const noticiaEncontrado = userNoticias.find((noticia) => noticia.id === id);
    setSelectedNoticia(noticiaEncontrado || null);
    setModalEliminarNoticiaOpen(true); // Trigger modal closing animation
  };
  
  const cerrarEliminarCentroModal = () => {
    setModalEliminarCentroOpen(false); // Trigger modal closing animation
  };

  const cerrarEliminarNoticiaModal = () => {
    setModalEliminarNoticiaOpen(false); // Trigger modal closing animation
  };

  const EliminarCentroModal = async (centroId) => {

    try {
      const response = await fetch(`/centro/${centroId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el centro');
      }
  
      setUserCentros((prevUserCentros) =>
        prevUserCentros.filter(centro => centro.id !== centroId)
      );
      cerrarEliminarCentroModal();
      setSelectedCentro(null);

    } catch (error) {
      console.error('Error al eliminar el centro:', error.message);
    }
  };

  const EliminarNoticiaModal = async (noticiaId) => {

    try {
      const response = await fetch(`/centro/${noticiaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el centro');
      }

      setUserNoticias((prevUserNoticias) =>
        prevUserNoticias.filter(noticia => noticia.id !== noticiaId)
      )
      
  
      cerrarEliminarNoticiaModal();
      setSelectedNoticia(null);

    } catch (error) {
      console.error('Error al eliminar el centro:', error.message);
    }
  };

  const EditarCentroModal = (id) => {
    window.location.href = `/EditarCentro/${id}`;
  };

  const EditarNoticiaModal = (id) => {
    window.location.href = `/EditarNoticia/${id}`;
  };

  return (
    <div className="welcome-container">
      {usuario ? (
        <>
          <h1 className="welcome-text">¡Bienvenido administrador {usuario.username}!</h1>
          <p className="welcome-message">Tus Contribuciones a la pagina son:</p>

          {/* Tabla de Centros de Ayuda Social */}
          <div className="table-container">
            <h2 className="table-title">Centros de Ayuda Social</h2>
            {userCentros && userCentros.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Centro</th>
                    <th>Registro</th>
                    <th>Dueño</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {userCentros.map((userCentro, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <p className="td-item td-centro-nombre">{userCentro.nombre}</p>
                          <p className="centro-details-separador" />
                          <p
                            className="td-item td-centro-tipo"
                            style={{
                              color: colorMap[userCentro.tipo_comedor] || colorMap.default,
                            }}
                          >
                            {tiposComedorMap[userCentro.tipo_comedor]}
                          </p>
                          <p className="td-item td-centro-direccion">{userCentro.formatted_address}</p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="td-item">
                            <span className="sub-td-centro-creado">Creado:</span>{" "}
                            <span className="sub-td-centro-fecha">{userCentro.fecha_creacion}</span>
                          </p>
                          {userCentro.fecha_ultima_edicion && (
                            <div>
                              <p className="centro-details-separador" />
                              <p className="td-item">
                                <span className="sub-td-centro-creado">Editado:</span>{" "}
                                <span className="sub-td-centro-fecha">{userCentro.fecha_ultima_edicion}</span>
                              </p>
                              <p className="td-item">
                                <span className="sub-td-centro-creado">Por:</span>{" "}
                                <span className="sub-td-centro-fecha">{userCentro.usuario_ultima_edicion.username}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="td-item sub-td-centro-dueño">{userCentro.nombre_dueño}</p>
                          <p className="centro-details-separador" />
                          {userCentro.telefono_dueño && (
                            <p className="td-item sub-td-centro-dueño-telefono">{userCentro.telefono_dueño}</p>
                          )}
                          {userCentro.mail_dueño && (
                            <p className="td-item sub-td-centro-dueño-mail">{userCentro.mail_dueño}</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='td-centro-btns-container'>
                          <button onClick={() => EditarCentroModal(userCentro.id)} className='centro-details-admin-btn centro-details-admin-btn-editar td-btns'>Editar Centro</button>
                          <button onClick={() => abrirModalEliminarCentro(userCentro.id)} className='centro-details-admin-btn centro-details-admin-btn-eliminar'>Eliminar Centro</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='error-msg'>No hay centros disponibles para mostrar.</p>
            )}

            <Modal
              question={"¿Estas seguro que quieres eliminar este centro?"}
              onCancel={cerrarEliminarCentroModal}
              onAccept={() => EliminarCentroModal(selectedCentro.id)}
              isOpen={modalEliminarCentroOpen}
              infoArray={[
                selectedCentro && selectedCentro.nombre ? selectedCentro.nombre : "Nombre no disponible", 
                selectedCentro && selectedCentro.formatted_address ? selectedCentro.formatted_address : "Dirección no disponible", 
                selectedCentro && selectedCentro.tipo_comedor ? tiposComedorMap[selectedCentro.tipo_comedor] : "Tipo de comedor no disponible"
              ]}
            />

          </div>

          {/* Tabla de Noticias */}
          <div className="table-container">
            <h2 className="table-title">Noticias</h2>
            {userNoticias && userNoticias.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Noticia</th>
                    <th>Registro</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {userNoticias.map((userNoticia, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <p className="td-item td-noticia-titulo">{userNoticia.titulo}</p>
                          <p className="centro-details-separador" />
                          <p className="td-item td-noticia-sub_titulo">{userNoticia.sub_titulo}
                          </p>
                          <p
                            className="td-item td-noticia-prioridad"
                            style={{
                              color: prioridadColorMap[userNoticia.prioridad] || prioridadColorMap.default
                            }}
                          >
                            {userNoticia.prioridad}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="td-item">
                            <span className="sub-td-centro-creado">Creado:</span>{" "}
                            <span className="sub-td-centro-fecha">{userNoticia.fecha_creacion}</span>
                          </p>
                          {userNoticia.fecha_ultima_edicion && (
                            <div>
                              <p className="centro-details-separador" />
                              <p className="td-item">
                                <span className="sub-td-centro-creado">Editado:</span>{" "}
                                <span className="sub-td-centro-fecha">{userNoticia.fecha_ultima_edicion}</span>
                              </p>
                              <p className="td-item">
                                <span className="sub-td-centro-creado">Por:</span>{" "}
                                <span className="sub-td-centro-fecha">{userNoticia.usuario_ultima_edicion.username}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='td-centro-btns-container'>
                          <button onClick={() => EditarNoticiaModal(userNoticia.id)} className='centro-details-admin-btn centro-details-admin-btn-editar'>Editar Centro</button>
                          <button onClick={() => abrirModalEliminarNoticia(userNoticia.id)} className='centro-details-admin-btn centro-details-admin-btn-eliminar'>Eliminar Centro</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='error-msg'>No hay noticias disponibles para mostrar.</p>
            )}

            <Modal
              question={"¿Estas seguro que quieres eliminar esta noticia?"}
              onCancel={cerrarEliminarNoticiaModal}
              onAccept={() => EliminarNoticiaModal(selectedNoticia.id)}
              isOpen={modalEliminarNoticiaOpen}
              infoArray={[
                selectedNoticia && selectedNoticia.titulo ? selectedNoticia.titulo : "titulo no disponible", 
                selectedNoticia && selectedNoticia.sub_titulo ? selectedNoticia.sub_titulo : "Sub titulo no disponible", 
                selectedNoticia && selectedNoticia.prioridad ? selectedNoticia.prioridad : "Prioridad no disponible"
              ]}
            />
          </div>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default AdminPerfil;
