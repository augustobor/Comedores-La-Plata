import React, { useState, useEffect } from 'react';
import "./Noticias.css";
import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import Modal from '../../Components/modals/modal'
import Loading_1 from '../../Components/Loadings/Loading_1/Loading_1';

const api_url = process.env.REACT_APP_API_URL || 'http://localhost';


// const [fetchedCenterCache, setFetchedCenterCache] = useState(
//   JSON.parse(localStorage.getItem('fetchedCenterCache')) || {}
// );

const Noticias = () => {
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [imagenesActuales, setImagenesActuales] = useState({});
  const [noticias, setNoticias] = useState([]);
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [noticiaEliminar, setNoticiaEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const noticiasPorPagina = 9;

  const indexOfLastNoticia = currentPage * noticiasPorPagina;
  const indexOfFirstNoticia = indexOfLastNoticia - noticiasPorPagina;
  const noticiasActuales = noticias.slice(indexOfFirstNoticia, indexOfLastNoticia);

  //----------------------------------------------------------------------------------

  useEffect(() => {
    const fetchAllNoticias = async () => {
      try {
        const response = await fetch(`${api_url}/noticia/`, {
          method: 'GET',
          mode: 'no-cors'
        });
        if (!response.ok) {
          throw new Error('Error al obtener las noticias');
        }
        const data = await response.json();
  
        // Ordenar por fecha (más nueva primero)
        data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  
        // Asignar peso a las prioridades
        const prioridadPeso = {
          'Urgente': 1,       // Mayor prioridad
          'Importante': 2,    // Mediana prioridad
          'Informativa': 3    // Menor prioridad
        };
  
        // Ordenar por prioridad (Urgente -> Importante -> Informativa)
        data.sort((a, b) => prioridadPeso[a.prioridad] - prioridadPeso[b.prioridad]);
  
        const imagenesIniciales = {};
        data.forEach(noticia => {
          imagenesIniciales[noticia.id] = 0;
        });
  
        setImagenesActuales(imagenesIniciales);
        setNoticias(data);
      } catch (error) {
        console.error('Error en el fetch:', error.message);
      }
    };
  
    fetchAllNoticias();
  }, []);

  //--------------------------------------------------------------------------------------

  const EliminarNoticiaModal = async (noticiaId) => {

    try {
      const response = await fetch(`${api_url}/noticia/${noticiaId}`, {
        method: 'DELETE',
        headers: {
          // Incluye aquí los headers necesarios para autenticación, si los tienes
          'Authorization': `Bearer ${jwt}` // Ejemplo con token JWT
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la noticia');
      }

      cerrarEliminarNoticiaModal();
      //setSelectedPlace(null);
      
      // Eliminar la noticia del caché

      // Eliminar la noticia de las ubicaciones
      const updatedNoticias = noticias.filter((noticia) => noticia.id !== noticiaId);
      setNoticias(updatedNoticias); // Asegúrate de que esto esté en su lugar


      // window.location.reload();
  
    } catch (error) {
      console.error('Error al eliminar la noticia:', error.message);
      // Maneja el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  //---------------------------------------------------------------------------------------

  useEffect(() => {
    const validateToken = async () => {
      if (jwt) {
        const isValid = await isTokenValid(jwt, () => setJwt(""));
        setTokenIsValid(isValid);
      } else {
        setTokenIsValid(false);
      }
      setIsLoading(false);
    };

    validateToken();
  }, [jwt]);

  const handleNoticiaClick = (id) => {
    setNoticiaSeleccionada(id === noticiaSeleccionada ? null : id);
  };

  const siguienteImagen = (id, imagenes) => {
    setImagenesActuales((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % imagenes.length,
    }));
  };

  const anteriorImagen = (id, imagenes) => {
    setImagenesActuales((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + imagenes.length) % imagenes.length,
    }));
  };

  const toggleLeerMas = (id) => {
    setNoticiaSeleccionada(id === noticiaSeleccionada ? null : id);
  };

  const abrirModalEliminar = (noticiaId) => {

    // Buscar la noticia en el array de noticias
    const noticia = noticias.find(noticia => noticia.id === noticiaId);

    // Actualizar el estado con la noticia encontrada
    setNoticiaAEliminar(noticia);  // Aquí deberías pasar el objeto de la noticia
    
    setNoticiaEliminar(noticiaId);
    setModalEliminarOpen(true); // Trigger modal closing animatio
  };

  const cerrarEliminarNoticiaModal = () => {
    setModalEliminarOpen(false); // Trigger modal closing animation
  };

  const getBorderClass = (prioridad) => {
    switch (prioridad) {
      case 'Urgente':
        return 'border-urgente'; // Clase para borde rojo
      case 'Importante':
        return 'border-importante'; // Clase para borde celeste
      case 'Informativa':
        return ''; // Sin borde
      default:
        return '';
    }
  };

  //---------------------------------------------------------------------

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setNoticiaSeleccionada(null);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(noticias.length / noticiasPorPagina)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  //--------------------------------------------------------------------

  if (isLoading) {
    // Mostrar la animación de carga mientras se valida el token
    return (
      <div className="loading-container">
        <Loading_1 />
        <p>Cargando...</p>
      </div>
    );
  }

  //--------------------------------------------------------------------

  return (
    <div className="noticias-wrapper">
      <h1 className="titulo-especial">Noticias</h1>
      {tokenIsValid && (
        <a href="/NoticiaNueva"
        // className="boton-anadir-noticias"
        className="add-center-btn nueva-noticia-btn"
        >Nueva Noticia</a>
      )}
  
      <div className="contenedor-de-todas-las-noticias">

      {noticiasActuales.length === 0 &&
        <p className='no-news-msg'>No hay noticias actualmente.</p>
      }

      {noticiasActuales.length > 0 && noticiasActuales.map((noticia) => (
          <div key={noticia.id} className={`noticia-container ${getBorderClass(noticia.prioridad)}`}>
            {noticia.imagenes && noticia.imagenes.length > 0 && (

                
              <div className="carrusel">
                {noticia.imagenes.length > 1 &&
                  <button
                    className="carrusel-boton izquierda"
                    onClick={() => anteriorImagen(noticia.id, noticia.imagenes)}
                  >
                    &#10094;
                  </button>
                }
                <img
                  src={`data:image/jpeg;base64,${noticia.imagenes[imagenesActuales[noticia.id]]?.datos}`}
                  alt={`Imagen ${imagenesActuales[noticia.id] + 1} de ${noticia.titulo}`}
                  className={`noticia-imagen ${noticiaSeleccionada === noticia.id ? 'active' : ''}`}
                />
                {noticia.imagenes.length > 1 &&
                  <button
                    className="carrusel-boton derecha"
                    onClick={() => siguienteImagen(noticia.id, noticia.imagenes)}
                  >
                    &#10095;
                  </button>
                }
              </div>
            )}


  
  
            <div className="noticia-info">
              <h2 className="noticia-titulo">
                {noticiaSeleccionada === noticia.id ? noticia.titulo : `${noticia.titulo.substring(0, 40)}...`}
              </h2>
              <h3 className="noticia-subtitulo">
                {noticiaSeleccionada === noticia.id ? noticia.sub_titulo : `${noticia.sub_titulo.substring(0, 50)}...`}
              </h3>

              <h3 className="noticia-fecha">
              {new Date(noticia.fecha_creacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>

              <p className="noticia-contenido">
                {noticiaSeleccionada === noticia.id ? noticia.texto : `${noticia.texto.substring(0, 50)}...`}
              </p>
              <button className="boton-leer-mas" onClick={() => toggleLeerMas(noticia.id)}>
                {noticiaSeleccionada === noticia.id ? 'Leer menos' : 'Leer más'}
              </button>
  
              {tokenIsValid && (
                <div className='noticia-container-btn-wrapper'>
                  <button
                    // className="boton-eliminar-noticias"
                    className="add-center-btn noticia-btn"
                    onClick={() => window.location.href = `${api_url}/EditarNoticia/${noticia.id}`}
                  >
                    Editar Noticia
                  </button>
                  <button
                    // className="boton-eliminar-noticias"
                    className="add-center-btn noticia-btn"
                    onClick={() => abrirModalEliminar(noticia.id)}
                  >
                    Eliminar Noticia
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
  
        <Modal
          question={"¿Estas seguro que quieres eliminar esta noticia?"}
          onCancel={cerrarEliminarNoticiaModal}
          onAccept={() => EliminarNoticiaModal(noticiaEliminar)}
          isOpen={modalEliminarOpen}
          infoArray={[
            noticiaAEliminar && noticiaAEliminar.titulo ? noticiaAEliminar.titulo : "Nombre no disponible", 
            noticiaAEliminar && noticiaAEliminar.sub_titulo ? noticiaAEliminar.sub_titulo : "Dirección no disponible", 
            noticiaAEliminar && noticiaAEliminar.prioridad ? noticiaAEliminar.prioridad : "Tipo de comedor no disponible"
          ]}
          img={
            noticiaAEliminar && noticiaAEliminar.imagenes && noticiaAEliminar.imagenes.length > 0 
            ? `data:image/jpeg;base64,${noticiaAEliminar.imagenes[0].datos}` 
            : "ruta-imagen-predeterminada.jpg"
          }
        />
      </div>

      {noticias && noticias.length > 9 && // Mostrar la paginacion solo si es necesaria
      <div className="paginacion">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span className='paginacion-span'>Página {currentPage} de {Math.ceil(noticias.length / noticiasPorPagina)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(noticias.length / noticiasPorPagina)}>
          Siguiente
        </button>
      </div>
      }
      
    </div>
  );
  
};

export default Noticias;

