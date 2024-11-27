import React, { useState } from 'react';
import './DELETE.css';

const DELETE = ({ onMessage }) => {
    const [id, setId] = useState(''); // Inicializar el estado con una cadena vacía

    // Maneja el cambio en el input para actualizar el estado `id`
    const handleChange = (e) => {
        setId(e.target.value);
    };

    // Maneja el botón para obtener todos los elementos
    const handleBtnDelAll = async () => {
        try {
            const response = await fetch('http://localhost:4000/ejemplo/all', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar la petición');
            }

            onMessage('Todos los ejemplos han sido eliminados.'); // Llama a la función de callback con el mensaje de error
        } catch (error) {
            console.error('Error:', error);
            onMessage('Error al eliminar todos los ejemplos'); // Llama a la función de callback con el mensaje de error
        }
    };

    // Maneja el botón para obtener un elemento por ID
    const handleBtnDelById = async () => {
        try {
            const response = await fetch(`http://localhost:4000/ejemplo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Error al realizar la petición');
            }
    
            // Verifica si la respuesta tiene cuerpo

            const message = `Ejemplo con id ${id} eliminado correctamente.`;
            onMessage(message); // Llama a la función de callback con el mensaje

        } catch (error) {
            console.error('Error:', error);
            const message = `Error al eliminar Ejemplo con id ${id}.`;
            onMessage(message); // Llama a la función de callback con el mensaje de error
        }
    };
    

    return (
        <div>
            <h2>DELETE</h2>
            <div className='botones'>
                <div>
                    <input 
                        type="text"
                        value={id}
                        onChange={handleChange} // Actualiza el estado `id` cuando el valor del input cambie
                        placeholder="Ingrese ID"
                    />
                    <button onClick={handleBtnDelById}>DELETE BY ID</button>
                </div>
                <button onClick={handleBtnDelAll}>DELETE ALL</button>
            </div>
        </div>
    );
};

export default DELETE;
