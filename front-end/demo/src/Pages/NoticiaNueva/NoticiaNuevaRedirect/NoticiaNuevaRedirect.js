import React from 'react'
import { useParams } from 'react-router-dom';
import NoticiaNueva from '../NoticiaNueva';

const NoticiaNuevaRedirect = () => {
    const { id } = useParams();
    return <div className="NoticiaNuevaRedirect" ><NoticiaNueva id={id} /></div>
}

export default NoticiaNuevaRedirect
