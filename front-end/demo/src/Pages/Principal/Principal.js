import React from 'react'
import "./Principal.css";

const Principal = () => {
  return (
    
      <section className="pr-hero">
        <h2 className='pr-hero-h2'>Inicio</h2>
        <p className='pr-p'>
        El objetivo de esta página es construir un mapeo de todos los sitios de distribución de alimentos
         (comedores, merenderos, copas de leche, etcétera) en los barrios de la ciudad de La Plata.

        La idea es que vos mismo, al conocer todos los lugares que están luchando contra el hambre, 
        puedas saber dónde acercarte para dar ayuda.
        </p>
        <br />
        <p className='pr-p'>
        Todos los sitios de distribución de alimentos hacen lo que pueden con los recursos que poseen y 
        con los contactos que tienen, por eso necesitan colaboradores, donaciones, voluntarios y el apoyo 
        de diversas instituciones y programas. Nadie lucha contra las desigualdades desde la soledad.

        Esta página se nutre de la información y los datos que cada persona pueda aportar. Serán verificados antes 
        de ser publicados y periódicamente se comprobará que el sitio de distribución de alimentos sigue en pie.
        </p>
        <br />
        <p className='pr-p'>
        En la sección de Noticias podés encontrar algunas actividades, invitaciones, capacitaciones 
        y urgencias de los barrios.

        Si te interesa sumar los datos de un sitio de distribución de alimentos o compartir alguna noticia,
         podés contactarnos a: comedores.platenses@gmail.com
        </p>

      </section>

  )
}

export default Principal
