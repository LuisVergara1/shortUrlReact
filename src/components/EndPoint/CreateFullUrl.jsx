import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomSnackbar from '../snackbar/snackBar';
import { createCustomUrl } from '../../services/urlService';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

const CreateFullUrl = () => {

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState(''); // Estado para almacenar la URL corta
    const [customUrl, setCustomUrl] = useState(''); // Estado para almacenar la URL corta


    useEffect(() => {
        if (showSnackbar) {
            const timer = setTimeout(() => {
                setShowSnackbar(false);
            }, 3000); // 3 segundos

            return () => clearTimeout(timer);
        }
    }, [showSnackbar]);

    const handleCreateUrl = async () => {
        if (!originalUrl.trim()) {
            setSnackbarMessage('El campo URL Original no puede estar vacío');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');
            return;
        }
        if (!customUrl.trim()) {
            setSnackbarMessage('El campo URL Personalizada no puede estar vacío');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');
            return;
        }
        if (customUrl.length > 10) {
            setSnackbarMessage('El campo URL Personalizada no puede tener más de 10 caracteres');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');    
            setCustomUrl('');
            return;
        }
        if (/[^a-zA-Z0-9]/.test(customUrl)) {
            setSnackbarMessage('El campo URL Personalizada solo puede contener letras y números');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setShortUrl('');    
            setCustomUrl('');
            return;
        }
        createCustomUrl(originalUrl,customUrl)
            .then(response => {
                if (response.status === 200) {
                    setOriginalUrl('');
                    setCustomUrl('');
                    setShortUrl(response.data); // Asignar la URL corta recibida del servidor
                    setSnackbarMessage('URL creada exitosamente');
                    setSnackbarSeverity('success');
                    setShowSnackbar(true);
                } else if (response.status === 400) {
                    setSnackbarMessage(response.data);
                    setSnackbarSeverity('error');
                    setShowSnackbar(true);
                    setShortUrl('');
                    setCustomUrl('');
                    setOriginalUrl(''); // Limpiar la URL corta en caso de error
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
                setShortUrl(''); // Limpiar la URL corta en caso de error
            });
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                setSnackbarMessage('URL copiada al portapapeles');
                setSnackbarSeverity('success');
                setShowSnackbar(true);
            })
            .catch(error => {
                setSnackbarMessage('Error al copiar la URL');
                setSnackbarSeverity('error');
                setShowSnackbar(true);
            });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Crear URL Personalizada
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Las URLs creadas tendrán una validez de 15 minutos.<br/>
            </Typography>
            <TextField
                label="URL Original"
                variant="outlined"
                fullWidth
                margin="normal"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                sx={{ maxWidth: '600px' }}
            />
            <br/>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Las URL Personalizadas solo acepta Letras y Numeros.<br/>
                La URL personalizada no puede tener más de 10 caracteres.
            </Typography>
              <TextField
                label="URL Personalizada"
                variant="outlined"
                fullWidth
                margin="normal"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                sx={{ maxWidth: '600px' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">sh.luisvergara.dev/r/</InputAdornment>
                }}
            /><br/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUrl}
            >
                Personalizar URL
            </Button>

            {shortUrl && (
                <Box mt={2} display="flex" alignItems="center"justifyContent="center">
                    <TextField
                        label="URL Corta"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={shortUrl}
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ maxWidth: '490px' }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCopyUrl}
                        style={{ marginLeft: '10px' }}
                    >
                        Copiar URL
                    </Button>
                </Box>
            )}

            <CustomSnackbar
                open={showSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setShowSnackbar(false)}
            />
        </Box>
    );
};

export default CreateFullUrl;