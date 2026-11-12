import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export default function ErrorMobal({ onClose }) {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="expired-title">
      <DialogTitle id="expired-title">Este enlace ya no está disponible</DialogTitle>
      <DialogContent dividers>
        <Typography color="text.secondary">Puede que el enlace haya vencido o que la dirección esté incompleta. Revisa la URL o, si tú creaste el enlace, vuelve al inicio para renovarlo.</Typography>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Volver al inicio</Button></DialogActions>
    </Dialog>
  );
}

ErrorMobal.propTypes = { onClose: PropTypes.func.isRequired };
