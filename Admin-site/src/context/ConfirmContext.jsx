import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    onCancel: null,
    isAlert: false
  });

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        message,
        isAlert: false,
        onConfirm: () => {
          setModalState(s => ({ ...s, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(s => ({ ...s, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const showAlert = useCallback((message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        message,
        isAlert: true,
        onConfirm: () => {
          setModalState(s => ({ ...s, isOpen: false }));
          resolve(true);
        },
        onCancel: null
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      {modalState.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>
              {modalState.isAlert ? 'Notice' : 'Confirm Action'}
            </h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{modalState.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              {!modalState.isAlert && (
                <button 
                  className="btn" 
                  style={{ background: 'var(--bg-lighter)', color: 'var(--text-main)' }} 
                  onClick={modalState.onCancel}
                >
                  Cancel
                </button>
              )}
              <button 
                className="btn btn-primary" 
                onClick={modalState.onConfirm}
              >
                {modalState.isAlert ? 'OK' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
