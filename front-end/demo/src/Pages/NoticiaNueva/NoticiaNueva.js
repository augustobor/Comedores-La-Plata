import React, { useState, useEffect } from 'react';
import './NoticiaNueva.css'; // Asegúrate de que la ruta del archivo CSS sea correcta

import { useLocalState } from '../../Utils/useLocalStorage';
import { isTokenValid } from '../../Utils/isTokenValid';
import CasPostFormPart2 from '../../Components/Centros/post/Formulario/PostFormParts/part2/PostFormPart2'
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoticiaNueva = ({ id }) => {

  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [prioridad, setPrioridad] = useState('Seleccione...');
  const [data, setData] = useState({}); // Estado para manejar las imágenes
  const [errorsForm2, setErrorsForm2] = useState({});
  const [localErrors, setLocalErrors] = useState({});


  const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
  const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token

  const editing = !!id;

  

  //-------------------------------------------------------------------------------------------------------------

  const navigate = useNavigate();
    
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

    useEffect(() => {
        validateToken(); // Llama a la función para validar el token
      }, [jwt]); // Solo se ejecuta cuando el JWT cambia

  //-------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (id) {
        
        fetch(`/noticia/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al obtener datos de la noticia");
            }
        })
        .then(data => {
            if (!data) {
                // Si no se obtiene ningún dato, redirigir al usuario
                navigate(-1); // Redirige a la página anterior
                return;
            }
            setTitulo(data.titulo);
            setSubtitulo(data.sub_titulo);
            setTexto(data.texto);
            setPrioridad(data.prioridad);
            setData({ imagenes: data.imagenes || [] });
        })
        .catch(error => {
            console.error("Error al obtener datos:", error);
            navigate(-1);
        });
    }
}, [id]);

    //-------------------------------------------------------------------------------------------------------

    const validateFormData = () => {

        let valid = true;
        
        // Verificar campos de formData3
        const newErrorsForm2 = {};
        const form2Fields = ["imagenes"];
        for (let field of form2Fields) {
            if (!data[field] || data[field].length === 0) {
                newErrorsForm2[field] = "Subir al menos una imagen."; // Marcar campo con error
                valid = false;
            }
        }
        setErrorsForm2(newErrorsForm2);

        // Verificar la prioridad
        if (prioridad === "Seleccione...") {
            localErrors["prioridad"] = "Seleccione un tipo de noticia."; // Asignar error para 'prioridad'
            valid = false;
        } else {
            delete localErrors["prioridad"];
        }

        return valid;
    }

  function handleSubmit(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        if(!validateFormData()) return;

        const formData = new FormData();

        // Agregar los valores del formulario al formData
        formData.append("titulo", titulo);
        formData.append("subtitulo", subtitulo);
        formData.append("texto", texto);
        formData.append("prioridad", prioridad);

        if (Array.isArray(data.imagenes) && data.imagenes.length > 0) {
            for (let i = 0; i < data.imagenes.length; i++) {
                const imagen = data.imagenes[i];

                // Verificar si datos es una cadena base64 sin prefijos
                if (typeof imagen.datos === 'string') {
                    const byteString = atob(imagen.datos); // Convertir a binario

                    const ab = new Uint8Array(byteString.length);
                    for (let j = 0; j < byteString.length; j++) {
                        ab[j] = byteString.charCodeAt(j);
                    }
                    const blob = new Blob([ab], { type: 'image/jpeg' }); // Usar tipo de imagen conocido
                    formData.append("imagenes", blob, `imagen_${i}.jpg`); // Aquí agregamos el blob
                } else {
                    console.error("El formato de imagen no es válido", imagen.datos);
                }
            }
        }

        const url = editing ? `/noticia/${id}` : "/noticia/";
        const method = editing ? "PUT" : "POST";

        // if(id) formData.append("id", id);

        //-------------------------------------------------------------------------------------------------------------
        // Realizar la solicitud al backend
        fetch(url, {
            headers: { Authorization: `Bearer ${jwt}` },
            method: method,
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/Noticias"
            }
        })
        .catch((error) => {
            alert("Ocurrió un error al enviar la noticia: " + error.message);
        });
    }

    //-------------------------------------------------------------------------------------------------------------

return (
    <div className="fondito-noticia-nueva">
        <div className="noticia-container-nueva">
            <p className='centro-details-separador'/>
            <h2 className="noticia-h2">Noticia Nueva</h2>
            <p className='centro-details-separador'/>
            <form className="noticia-form" onSubmit={handleSubmit}>
                <div className="noticia-form-group">
                    <label htmlFor="titulo" className="noticia-label">Título:</label>
                    <input
                        type="text"
                        id="titulo"
                        className="noticia-input"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </div>

                <div className="noticia-form-group">
                    <label htmlFor="subtitulo" className="noticia-label">Subtítulo:</label>
                    <input
                        type="text"
                        id="subtitulo"
                        className="noticia-input"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        required
                    />
                </div>

                <div className="noticia-form-group">
                    <label htmlFor="texto" className="noticia-label">Texto de la Noticia:</label>
                    <textarea
                        id="texto"
                        className="noticia-textarea"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        required
                    />
                </div>

                {/* Componente que maneja la subida de imágenes */}
                <div className='form-part-container'>
                    <CasPostFormPart2
                        data={data} // Cambia 'fotos' a 'imagenes'
                        setData={setData}
                        formErrors={errorsForm2}
                    />
                </div>



                <div className="noticia-form-group">
                    <label htmlFor="prioridad" className="noticia-label">Prioridad:</label>
                    <select
                        id="prioridad"
                        className="noticia-select"
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                    >
                        <option value="Seleccione..." className="noticia-prioridad-seleccione">Seleccione...</option>
                        <option value="Urgente" className="noticia-prioridad-urgente">Urgente</option>
                        <option value="Importante" className="noticia-prioridad-importante">Importante</option>
                        <option value="Informativa" className="noticia-prioridad-informativa">Informativa</option>
                    </select>
                    {localErrors.prioridad && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>{localErrors.prioridad}</p>}
                </div>

                <div className="noticia-button-group">
                <button 
                    type="submit" 
                    className="noticia-buttons noticia-button">
                    {editing ? "Actualizar" : "Guardar"}
                </button>

                <button type="button" className="noticia-buttons cancel-button" 
                    onClick={() => window.location.href = "/Noticias"}>
                    Volver
                </button>

                </div>
            </form>
        </div>
    </div>
);
};

export default NoticiaNueva;