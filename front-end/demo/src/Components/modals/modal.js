import React from 'react';
import './modal.css';

const Modal = ({ question, onAccept, onCancel, isOpen, infoArray, img }) => {

    return (
        <>
            {/* <button onClick={handleOpen}>Abrir Modal</button> */}
                {isOpen && (
                <div className="modal">
                    <div className='modal-header'>
                        <h3>{question}</h3>
                    <button
                        className="close-detalis-btn"
                        onClick={onCancel}
                        >
                        X
                    </button>
                    </div>
                    <div className="modal-wrapper">
                        <p className='centro-details-separador'/>
                        <div className='modal-content'>
                            <div className='modal-info'>
                                <div className='modal-text'>
                                {infoArray && infoArray.map((info, index) => {
                                    // Alternar entre h3, h4 y h5 según el índice
                                    const HeaderTag = index % 3 === 0 ? 'h3' : index % 3 === 1 ? 'h4' : 'h5';

                                    // Comprobar si la longitud es mayor a 50 caracteres para agregar los puntos suspensivos
                                    const displayText = info.length > 50 ? info.substring(0, 50) + '...' : info;

                                    return <HeaderTag key={index}>{displayText}</HeaderTag>;
                                })}

                                </div>

                                {img && (
                                    <div className='modal-img'>
                                        <img src={img || "defaultImage.jpg"} alt="Modal" />
                                    </div>
                                )}

                            </div>
                            {/* <p className='modal-question'>{question}</p> */}
                            <p className='centro-details-separador'/>

                            <div className="modal-buttons">
                                <button onClick={onCancel}>Cancelar</button>
                                <button onClick={onAccept}>Aceptar</button>
                            </div>
                        </div>
                        <p className='centro-details-separador'/>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;