import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomSnackbar from '../snackbar/snackBar';
import { createUrl } from '../../services/urlService';
import Typography from '@mui/material/Typography';

const CreateURL = () => {

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState(''); // Estado para almacenar la URL corta

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
            return;
        }

        createUrl(originalUrl)
            .then(response => {
                if (response.status === 200) {
                    setOriginalUrl('');
                    setShortUrl(response.data); // Asignar la URL corta recibida del servidor
                    setSnackbarMessage('URL creada exitosamente');
                    setSnackbarSeverity('success');
                    setShowSnackbar(true);
                } else if (response.status === 400) {
                    setSnackbarMessage('No se pudo crear la URL');
                    setSnackbarSeverity('error');
                    setShowSnackbar(true);
                    setShortUrl(''); // Limpiar la URL corta en caso de error
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setSnackbarMessage('No se pudo crear la URL');
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
                Crear URL 
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Las URLs creadas tendrán una validez de 15 minutos.
            </Typography>
            <TextField
                label="URL Orignal"
                variant="outlined"
                fullWidth
                margin="normal"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                sx={{ maxWidth: '600px' }}
            />
            <br/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUrl}
            >
                Crear URL 
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

export default CreateURL;