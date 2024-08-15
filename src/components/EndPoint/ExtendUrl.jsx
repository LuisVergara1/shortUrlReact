import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomSnackbar from '../snackbar/snackbar';
import { extendUrl as extendUrlApi } from '../../services/UrlService';
import Typography from '@mui/material/Typography';

const ExtendUrl = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [customUrl, setCustomUrl] = useState(''); // Estado para almacenar la URL corta

    useEffect(() => {
        if (showSnackbar) {
            const timer = setTimeout(() => {
                setShowSnackbar(false);
            }, 2000); // 2 segundos

            return () => clearTimeout(timer);
        }
    }, [showSnackbar]);

    const extractLastPart = (url) => {
        const baseUrl = 'https://sh.luisvergara.dev/r/';
        return url.replace(baseUrl, '');
    };

    const isValidUrl = (url) => {
        const regex = /^https:\/\/sh\.luisvergara\.dev\/r\/.+$/;
        return regex.test(url);
    };

    const extendUrl = () => {
        if (!customUrl.trim()) {
            setSnackbarMessage('Ingrese una URL a Renovar');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setCustomUrl('');
            return;
        }

        if (!isValidUrl(customUrl)) {
            setSnackbarMessage('Ingrese una URL válida');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setCustomUrl('');
            return;
        }

        const lastPart = extractLastPart(customUrl);
        console.log(lastPart);

        extendUrlApi(lastPart)
            .then(response => {
                if (response.status === 200) {
                    setCustomUrl('');
                    setSnackbarMessage(response.data);
                    setSnackbarSeverity('success');
                    setShowSnackbar(true);
                } else if (response.status === 400) {
                    setSnackbarMessage(response.data);
                    setSnackbarSeverity('error');
                    setShowSnackbar(true);
                    setCustomUrl(''); // Limpiar la URL corta en caso de error
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setSnackbarMessage(error.response.data);
                    setSnackbarSeverity('error');
                } else {
                    setSnackbarMessage('Error al crear la URL');
                    setSnackbarSeverity('error');
                }
                setShowSnackbar(true);
                setCustomUrl(''); // Limpiar la URL corta en caso de error
            });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Renovar URL
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Renueva tu URL por 15 minutos <br />
                Sin limites de Renovacion
            </Typography>
            <TextField
                label=""
                variant="outlined"
                fullWidth
                margin="normal"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder='sh.luisvergara.dev/r/linkedin'
                sx={{ maxWidth: '600px' }}
            />
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={extendUrl}
            >
                Renovar
            </Button>

            <CustomSnackbar
                open={showSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setShowSnackbar(false)}
            />
        </Box>
    );
};

export default ExtendUrl;