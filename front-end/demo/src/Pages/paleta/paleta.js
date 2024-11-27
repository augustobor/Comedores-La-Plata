import React from 'react';
import './paleta.css';
import '../../paletaColores.css'

const colors = [
  { name: 'Blanco', varName: '--color-blanco', fontColor: '--color-negro' },
  { name: 'Negro', varName: '--color-negro', fontColor: '--color-blanco' },
  { name: 'Amarillo', varName: '--color-amarillo', fontColor: '--color-negro' },
  { name: 'Beige', varName: '--color-beige', fontColor: '--color-negro' },
  { name: 'Naranja', varName: '--color-naranja', fontColor: '--color-negro' },
  { name: 'Marrón', varName: '--color-marron', fontColor: '--color-negro' },
  { name: 'Rojo', varName: '--color-rojo', fontColor: '--color-negro' },
  { name: 'Verde', varName: '--color-verde', fontColor: '--color-negro' },
  { name: 'Gris Oscuro', varName: '--color-gris-oscuro', fontColor: '--color-blanco' },
  { name: 'Gris Suave', varName: '--color-gris-suave', fontColor: '--color-negro' }
];

const ColorDisplay = ({ name, varName, fontColor }) => {
  return (
    <div className="color-column" style={{ backgroundColor: `var(${varName})`, color: `var(${fontColor})` }}>
      <p>{name}</p>
    </div>
  );
};

const Paleta = () => {
  return (
    <div className="paleta-container">
      <div className="color-row">
        {colors.map((color, index) => (
          <ColorDisplay key={index} name={color.name} varName={color.varName} fontColor={color.fontColor} />
        ))}
      </div>
    </div>
  );
};

export default Paleta;
