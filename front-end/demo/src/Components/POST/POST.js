import React, { useState } from 'react';

const POST = ({ onMessage }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellido':
                setApellido(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            nombre: nombre,
            apellido: apellido
        };

        try {
            const response = await fetch('http://localhost:4000/ejemplo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al realizar la petición');
            }

            const result = await response.json();

            const message = `Ejemplo creado correctamente: ID ${result.id}, Nombre ${result.nombre}, Apellido ${result.apellido}`;
            onMessage(message); // Llama a la función de callback con el mensaje

        } catch (error) {
            const message = `Error al crear el ejemplo: Nombre ${data.nombre}, Apellido ${data.apellido}`;
            onMessage(message); // Llama a la función de callback con el mensaje de error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>POST</h2>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="apellido">Apellido:</label>
                <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={apellido}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">POST</button>
        </form>
    );
};

export default POST;
