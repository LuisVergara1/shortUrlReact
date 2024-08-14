import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);

  const showExpiredModal = () => setIsExpiredModalOpen(true);
  const hideExpiredModal = () => setIsExpiredModalOpen(false);

  return (
    <ModalContext.Provider value={{ isExpiredModalOpen, showExpiredModal, hideExpiredModal }}>
      {children}
    </ModalContext.Provider>
  );
};