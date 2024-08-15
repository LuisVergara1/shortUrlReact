import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomSnackbar from '../snackbar/snackbar';
import { deleteUrl } from '../../services/UrlService';
import Typography from '@mui/material/Typography';

const DeleteUrl = () => {

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [shortUrl, setShortUrl] = useState('');


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

    const handleDelete = () => {
        if (!shortUrl.trim()) {
            setSnackbarMessage('Ingrese una URL a Eliminar');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');
            return;
        }

        if (!isValidUrl(shortUrl)) {
            setSnackbarMessage('Ingrese una URL válida');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');
            return;
        }

        const lastPart = extractLastPart(shortUrl);

        console.log(lastPart);
        deleteUrl(lastPart)
            .then(response => {
                if (response.status === 200) {
                    setShortUrl(''); // Limpiar la URL corta después de eliminar
                    setSnackbarMessage(response.data); // Mostrar el mensaje del backend
                    setSnackbarSeverity('success');
                    setShowSnackbar(true);
                } else if (response.status === 400) {
                    setSnackbarMessage(response.data); // Mostrar el mensaje del backend
                    setSnackbarSeverity('error');
                    setShowSnackbar(true);
                    setShortUrl(''); // Limpiar la URL corta en caso de error
                }
            })
            .catch(error => {
                const errorMessage = error.response?.data || 'Error deleting URL';
                setSnackbarMessage(errorMessage); // Mostrar el mensaje del backend o un mensaje de error genérico
                setSnackbarSeverity('error');
                setShowSnackbar(true);
                setShortUrl(''); // Limpiar la URL corta en caso de error
            });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Eliminar URL
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Elimina la URL  <br/>
                Se permite eliminar la URL si no se encuentra en uso <br/>
            </Typography>
            <TextField
                label=""
                variant="outlined"
                fullWidth
                margin="normal"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                placeholder='sh.luisvergara.dev/r/linkedin'
                sx={{ maxWidth: '600px' }}
            />
            <br />
            <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
            >
                Eliminar  
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

export default DeleteUrl;