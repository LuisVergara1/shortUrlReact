import React, { useContext, useEffect } from 'react';
import CreateURL from "./EndPoint/CreateUrl";
import CreateFullUrl from "./EndPoint/CreateFullUrl";
import ExtendUrl from "./EndPoint/ExtendUrl";
import DeleteUrl from './EndPoint/DeleteUrl.jsx';
import Box from '@mui/material/Box';
import { ModalContext } from "./Mobal/ModalContext.jsx";
import ErrorMobal from "./Mobal/ErrorMobal";
import { useLocation, useNavigate } from 'react-router-dom';
import ListUrl from './EndPoint/ListUrl.jsx';

const URLManager = () => {
  const { isExpiredModalOpen, showExpiredModal, hideExpiredModal } = useContext(ModalContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/url_not_found') {
      showExpiredModal();
    }
  }, [location, showExpiredModal]);

  const handleClosedExpiredModal = () => {
    hideExpiredModal();
    navigate('/');
  };

  return (
    <Box>
      <ListUrl />
      <CreateURL />
      <br />
      <CreateFullUrl />
      <br />
      <ExtendUrl />
      <br />
      <DeleteUrl />
      {isExpiredModalOpen && <ErrorMobal onClose={handleClosedExpiredModal} />}
    </Box>
  );
};

export default URLManager;