import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, TextField, Typography } from '@mui/material';
import {
  createLink, deleteUrl, extendUrl, getShortCode, requestMessage, storedManagementKey,
} from '../../services/UrlService';

const actions = {
  create: { title: 'Crear URL', button: 'Crear' },
  custom: { title: 'Crear URL personalizada', button: 'Crear' },
  extend: { title: 'Renovar URL', button: 'Renovar' },
  delete: { title: 'Eliminar URL', button: 'Eliminar' },
};

export default function LinkAction({ action, initialLink = '', duration, onClose, onSuccess }) {
  const { title, button } = actions[action];
  const creating = action === 'create' || action === 'custom';
  const [url, setUrl] = useState(initialLink);
  const [shortUrl, setShortUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [key, setKey] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const code = creating ? null : getShortCode(url);
  const savedKey = code ? storedManagementKey(code) : '';
  const color = action === 'delete' ? 'error' : 'primary';

  async function submit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setCopyMessage('');
    if (!creating && !code) {
      setError('Ingresa una URL corta o un código válido.');
      return;
    }
    setPending(true);
    try {
      if (creating) {
        setResult(await createLink({
          urlOriginal: url.trim(),
          shortUrl: action === 'custom' ? shortUrl.trim() : undefined,
          alias: alias.trim() || undefined,
          managementKey: alias.trim() ? key : undefined,
        }));
      } else {
        const operation = action === 'extend' ? extendUrl : deleteUrl;
        const { data } = await operation(code, key || savedKey);
        if (action === 'delete') setUrl('');
        setResult({ message: data });
        onSuccess?.();
      }
      setKey('');
    } catch (requestError) {
      setError(requestMessage(requestError, 'No pudimos completar la operación. Inténtalo de nuevo.'));
    } finally {
      setPending(false);
    }
  }

  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage('Copiado al portapapeles.');
    } catch {
      setCopyMessage('Selecciona el texto y cópialo manualmente.');
    }
  }

  return (
    <Dialog open onClose={pending ? undefined : onClose} aria-labelledby="link-action-title" fullWidth maxWidth="sm">
      <form onSubmit={submit}>
        <DialogTitle id="link-action-title">{title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {creating && duration && <Typography variant="body2">Vigencia inicial de {duration}.</Typography>}
            <TextField autoFocus required label={creating ? 'URL original' : 'URL corta o código'}
              type={creating ? 'url' : 'text'} value={url} onChange={(event) => setUrl(event.target.value)} />
            {action === 'custom' && (
              <TextField required label="Código personalizado" value={shortUrl}
                inputProps={{ pattern: '[a-zA-Z0-9]{1,10}', maxLength: 10 }}
                helperText="Hasta 10 letras o números." onChange={(event) => setShortUrl(event.target.value)} />
            )}
            {creating && (
              <TextField label="Alias de la lista (opcional)" value={alias}
                inputProps={{ maxLength: 64 }} onChange={(event) => setAlias(event.target.value)} />
            )}
            {((creating && alias.trim()) || (!creating && !savedKey)) && (
              <TextField required label="Clave de gestión" type="password" value={key} autoComplete="off"
                inputProps={{ minLength: creating ? 8 : undefined, maxLength: 128 }}
                onChange={(event) => setKey(event.target.value)}
                helperText={creating ? 'Elige una clave para un alias nuevo o usa la de tu lista. Mínimo 8 caracteres.' : 'Usa la clave de la lista o la del enlace.'} />
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {result?.message && <Alert severity="success">{result.message}</Alert>}
            {result?.url && (
              <Stack spacing={1}>
                <Link href={result.url} target="_blank" rel="noopener noreferrer" sx={{ overflowWrap: 'anywhere' }}>
                  {result.url}
                </Link>
                <Button onClick={() => copy(result.url)}>Copiar URL</Button>
                {result.key && (
                  <>
                    <TextField label="Clave del enlace" value={result.key} InputProps={{ readOnly: true }}
                      helperText={result.keySaved ? 'Guardada en este navegador.' : 'Cópiala para renovar o eliminar el enlace.'} />
                    <Button onClick={() => copy(result.key)}>Copiar clave</Button>
                  </>
                )}
                {copyMessage && <Typography role="status" variant="body2">{copyMessage}</Typography>}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={pending}>Cerrar</Button>
          <Button type="submit" color={color} variant="contained" disabled={pending}>
            {pending ? 'Procesando…' : button}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

LinkAction.propTypes = {
  action: PropTypes.oneOf(Object.keys(actions)).isRequired,
  initialLink: PropTypes.string,
  duration: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};
