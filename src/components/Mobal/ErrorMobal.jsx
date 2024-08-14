import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const ErrorMobal = ({ onClose }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          La URL no se encuentra Disponible <br/>
          Verificar la URL ingresada <br/>
          o Renueva la URL
        </Typography>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Ir a Inicio</button>
      </Box>
    </Modal>
  );
};

export default ErrorMobal;