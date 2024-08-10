import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
        <i class="fa-solid fa-circle-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
