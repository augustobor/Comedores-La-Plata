import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './PostForm.css';

import { useLocalState } from '../../../../Utils/useLocalStorage';
import { isTokenValid } from '../../../../Utils/isTokenValid';

import PostFormPart1 from "./PostFormParts/part1/PostFormPart1";
import PostFormPart2 from "./PostFormParts/part2/PostFormPart2";
import PostFormPart3 from "./PostFormParts/part3/PostFormPart3";
import { FaExclamationCircle } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const PostForm = ({ id }) => {

    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0); // Índice del formulario actual
    const [fade, setFade] = useState(true); // Estado para controlar la opacidad (fade)

    const [jwt, setJwt] = useLocalState("", "jwt"); // Obtén el token desde el local storage
    const [tokenIsValid, setTokenIsValid] = useState(false); // Estado para almacenar la validación del token

    const [fetchedData, setFetchedData] = useState(null);

    const editing = !!id; // Si hay un id, editing es true

    // Estados para cada formulario
    const [formData1, setFormData1] = useState({}); 
    const [formData2, setFormData2] = useState({});
    const [formData3, setFormData3] = useState({});

    const tiposComedorMap = {
        COMEDOR_COMUNITARIO: "Comedor Comunitario",
        MERENDERO: "Merendero",
        COPA_DE_LECHE: "Copa de Leche",
        DISTRIBUIDORA_DE_ALIMENTOS: "Distribuidora de Alimentos",
        CENTRO_DE_PRODUCCION_DE_VIANDAS: "Centro de Producción de Viandas"
    };

    useEffect(() => {
    
        if (id) {
            fetch(`${API_URL}/centro/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Centro no encontrado");
                }
            })
            .then(data => {
                if (!data) {
                    // Si no se obtiene ningún dato, redirigir al usuario
                    navigate(-1); // Redirige a la página anterior
                    return;
                }
    
                setFormData1({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    tipoComedor: data.tipo_comedor,
                    nombreDueño: data.nombre_dueño,
                    telefonoDueño: data.telefono_dueño,
                    mailDueño: data.mail_dueño
                });
                setFormData2({
                    imagenes: data.imagenes || []
                });
                setFormData3({
                    formattedAddress: data.formatted_address,
                    latitud: data.latitud,
                    longitud: data.longitud
                });
                setCenter([{ lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) }]);
                setCurrentDir(data.formatted_address);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                navigate(-1); // Redirigir al usuario si hay un error
            });
        }
    }, [id, jwt, navigate]);
    
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

    const [errorsForm1, setErrorsForm1] = useState({});
    const [errorsForm2, setErrorsForm2] = useState(false); // Solo para verificar imágenes
    const [errorsForm3, setErrorsForm3] = useState({});

    const [errors, setErrors] = useState(false);

    useEffect(() => {
        // Revisa si hay errores en alguno de los formularios
        setErrors(!!(Object.keys(errorsForm1).length || errorsForm2 || Object.keys(errorsForm3).length));
      }, [errorsForm1, errorsForm2, errorsForm3]);

    const [center, setCenter] = useState([]);

    const [currentDir, setCurrentDir] = useState([]);
    
    const forms = [
        <PostFormPart1 data={formData1} setData={setFormData1} formErrors={errorsForm1} editing={editing}/>,
        <PostFormPart2 data={formData2} setData={setFormData2} formErrors={errorsForm2} editing={editing}/>,
        <PostFormPart3 data={formData3} setData={setFormData3} formErrors={errorsForm3} editing={editing} center={center} setCenter={setCenter} currentDir={currentDir}/>
    ];

    const logInfo = () => {
        console.log("F1: ", formData1);
        console.log("F2: ", formData2);
        console.log("F3: ", formData3);
    };

    const handleNext = () => {
        setFade(false); // Inicia la animación de desvanecimiento
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1 < forms.length ? prevIndex + 1 : prevIndex)); 
            setFade(true); // Vuelve a hacer visible el formulario
        }, 500); 
    };

    const handlePrev = () => {
        setFade(false); // Inicia la animación de desvanecimiento
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 >= 0 ? prevIndex - 1 : prevIndex)); 
            setFade(true); // Vuelve a hacer visible el formulario
        }, 500); 
    };

    const validateFormData = () => {
        let valid = true;
    
        // Verificar campos de formData1
        const newErrorsForm1 = {};
        const form1Fields = ["nombre", "descripcion", "nombreDueño", "telefonoDueño", "mailDueño", "tipoComedor"];
        for (let field of form1Fields) {
            if (!formData1[field] || formData1[field].trim() === "") {
              newErrorsForm1[field] = "Este campo es obligatorio."; // Mensaje de error personalizado
              valid = false;
            } else {
              // Validaciones específicas
              switch (field) {
                case "nombre":
                    if(!/^[\p{L}0-9\s|°\\`!"#&()?¡'¿´¨+*,;.\-_:]+$/u.test(formData1[field])) {
                        newErrorsForm1[field] = "El nombre solo puede contener letras, números y espacios.";
                        valid = false;
                    }
                    break;
                case "descripcion":
                    if (!/^[\p{L}0-9\s|°\\~^`!"#$%&/()=?¡'¿´¨+*{[\]},;.\-_:]+$/u.test(formData1[field])) {
                        newErrorsForm1[field] = "El nombre solo puede contener letras, números y espacios.";
                        valid = false;
                    }
                    break;
                case "nombreDueño":
                    if (!/^[\p{L}0-9\s`"'´¨,.:]+$/u.test(formData1[field])) {
                        newErrorsForm1[field] = "El nombre del dueño solo puede contener letras y espacios.";
                        valid = false;
                    }
                    break;
                case "telefonoDueño":
                    if (!/^[+]?\d+(\s+\d+)*$/.test(formData1[field])) {
                        newErrorsForm1[field] = "El teléfono solo puede contener números y espacios (puede iniciar con '+').";
                        valid = false;
                    }
                    break;
                case "mailDueño":
                    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,3}(?:\.[a-zA-Z]{2})?$/;
                    if (!emailRegex.test(formData1[field])) {
                        newErrorsForm1[field] = "Ingrese un correo electrónico válido.";
                        valid = false;
                    }
                    break;
                }
            }
        }
        setErrorsForm1(newErrorsForm1); // Actualizar errores para formData1

        // Verificar campos de formData3
        const newErrorsForm2 = {};
        const form2Fields = ["imagenes"];
        for (let field of form2Fields) {
            if (!formData2[field] || formData2[field].length === 0) {
                newErrorsForm2[field] = "Subir al menos una imagen."; // Marcar campo con error
                valid = false;
            }
        }
        setErrorsForm2(newErrorsForm2); // Actualizar errores para formData2


    
        // Verificar campos de formData3
        const newErrorsForm3 = {};
        const form3Fields = ["formattedAddress", "latitud", "longitud"];
        for (let field of form3Fields) {
            if (!formData3[field]) {
                newErrorsForm3[field] = true; // Marcar campo con error
                valid = false;
            }
        }
        setErrorsForm3(newErrorsForm3); // Actualizar errores para formData3
    
        return valid; // Si no hay errores, retornar true
    };
    
    function logFormData(formData) {
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    }

    // Enviar los datos al backend
    async function handleSubmit() {
        // Validar los datos del formulario
        if (!validateFormData()) return;
    
        const formData = new FormData();  // Usar FormData para enviar archivos
    
        // Agregar los datos del formulario al FormData
        formData.append("id", id);
        formData.append("nombre", formData1.nombre);
        formData.append("descripcion", formData1.descripcion);
        formData.append("tipoComedor", formData1.tipoComedor);
        formData.append("nombreDueño", formData1.nombreDueño);
        formData.append("telefonoDueño", formData1.telefonoDueño);
        formData.append("mailDueño", formData1.mailDueño);
    
        // Manejar las imágenes
        if (Array.isArray(formData2.imagenes) && formData2.imagenes.length > 0) {
            for (let i = 0; i < formData2.imagenes.length; i++) {
                const imagen = formData2.imagenes[i];
    
                if (typeof imagen.datos === 'string') {
                    const byteString = atob(imagen.datos); // Convertir a binario
                    const ab = new Uint8Array(byteString.length);
                    for (let j = 0; j < byteString.length; j++) {
                        ab[j] = byteString.charCodeAt(j);
                    }
                    const blob = new Blob([ab], { type: 'image/jpeg' });
                    formData.append("imagenes", blob, `imagen_${i}.jpg`); // Agregar blob de imagen
                } else {
                    console.error("El formato de imagen no es válido", imagen.datos);
                    alert("El formato de imagen no es válido"); // Notificar al usuario
                    return; // Detener el proceso si el formato de imagen es incorrecto
                }
            }
        }
    
        // Determinar el método y la URL
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/centro/${id}` : `${API_URL}/centro/`;
    
        if (id) formData.append("id", id);
    
        formData.append("formattedAddress", formData3.formattedAddress);
        formData.append("latitud", `${formData3.latitud}`);
        formData.append("longitud", `${formData3.longitud}`);
    
        try {
            // Enviar el formulario
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                method: method,
                body: formData,
            });
    
            if (response.status === 200) {
                console.log("Centro guardado correctamente:", await response.json());
                navigate("/Mapa"); // Redirigir si la operación fue exitosa
            } else if (response.status === 400) {
                // Si hay un error de validación del servidor
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Hubo un problema con los datos enviados'}`);
            } else if (response.status === 401) {
                // Si el JWT es inválido
                alert("Token inválido o expirado. Por favor, inicie sesión nuevamente.");
                navigate("/Login"); // Redirigir a la página de login si el token no es válido
            } else {
                alert("Direccion del centro ya en uso.");
            }
        } catch (error) {
            // Capturar errores de red (por ejemplo, sin conexión)
            console.error("Error en la solicitud:", error);
        }
    }
    

    return (
        <div className="fondito-centro-post-form">
            <div className="CentroPostFormContainer">
                
                {/* <h2>Formulario Centro de Ayuda Social</h2> */}

                <div className={`form_part part_${currentIndex+1} ${fade ? 'fade-in' : 'fade-out'}`}>
                    {forms[currentIndex]} {/* Muestra el formulario correspondiente al índice actual */}
                </div>

                <div className="buttonContainer">
                    <button className="login-buttons login-button" onClick={currentIndex === 0 ? () => navigate("/Mapa") : handlePrev} >{currentIndex === 0 ? "Volver" : "Anterior"}</button>
                    {currentIndex < forms.length - 1 ? (
                        <button className="login-buttons login-button" onClick={handleNext}>Siguiente</button>
                    ) : (
                        <button className="login-buttons login-button" onClick={handleSubmit}>{id ? "Guardar" : "Subir"}</button>
                    )}
                </div>
                {errors && errors === true && <p className="centro-details-error-1"><FaExclamationCircle style={{ paddingLeft: '2px', paddingTop: '3px' }}/>Hay errores en el formulario.</p>}

            </div>
        </div>
    );
};

export default PostForm;
