import React, { useState } from 'react';
import './GET.css';

const API_URL = process.env.API_URL || 'http://localhost:4000';


const GET = ({ onMessage }) => {
    const [id, setId] = useState(''); // Inicializar el estado con una cadena vacía

    // Maneja el cambio en el input para actualizar el estado `id`
    const handleChange = (e) => {
        setId(e.target.value);
    };

    // Maneja el botón para obtener todos los elementos
    const handleBtnGetAll = async () => {
        try {
            const response = await fetch(`${API_URL}/ejemplo/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al realizar la petición');
            }

            const results = await response.json();

            onMessage('Todos los ejemplos:');

            var index = 1;

            results.forEach(result => {

                const message = `   ${index}   Ejemplo obtenido: ID ${result.id}, Nombre ${result.nombre}, Apellido ${result.apellido}`;
                index++;
                onMessage(message);
            });

        } catch (error) {
            onMessage('Error al obtener los ejemplos');
        }
    };

    // Maneja el botón para obtener un elemento por ID
    const handleBtnGetById = async () => {
        try {
            const response = await fetch(`${API_URL}/ejemplo/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Error al realizar la petición');
            }
    
            // Verifica si la respuesta tiene cuerpo
            const text = await response.text();

            if ( text ) {
                const result = JSON.parse(text);
                onMessage(`Ejemplo obtenido con exito: ${result.apellido} ${result.nombre}`);
            } else {
                onMessage(`Ejemplo con id ${id} no existe.`)
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div>
            <h2>GET</h2>
            <div className='botones'>
                <div>
                    <input 
                        type="text"
                        value={id}
                        onChange={handleChange} // Actualiza el estado `id` cuando el valor del input cambie
                        placeholder="Ingrese ID"
                    />
                    <button onClick={handleBtnGetById}>GET BY ID</button>
                </div>
                <button onClick={handleBtnGetAll}>GET ALL</button>
            </div>
        </div>
    );
};

export default GET;
