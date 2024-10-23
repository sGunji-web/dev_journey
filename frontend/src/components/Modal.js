import React from 'react';
import '../css/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null; // モーダルが閉じている場合は何も描画しない
    }

return (
    <>
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                    {children}
                </div>
        </div>
    
    </>

);
};
  
  export default Modal;