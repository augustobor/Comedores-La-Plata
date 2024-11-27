import React, { useEffect, useRef } from 'react';
import './Console.css';

const Console = ({ messages }) => {

    const consoleRef = useRef(null);

    useEffect(() => {
        // Scrollea hasta el fondo cuando se agregan nuevos mensajes
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='console' ref={consoleRef}>
            <div className='text'>
                {messages && messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
};

export default Console;
