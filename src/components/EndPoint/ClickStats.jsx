import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, List, ListItem,
  ListItemText, Pagination, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { getAliasStats, getLinkStats, getShortCode, requestMessage } from '../../services/UrlService';

export default function ClickStats({ onClose, onManage, revision }) {
  const [mode, setMode] = useState('url');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(null);

  async function copyLink(link) {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopyFeedback({ code: link.shortCode, message: 'URL copiada.' });
    } catch {
      setCopyFeedback({ code: link.shortCode, message: 'Selecciona la URL para copiarla manualmente.' });
    }
  }

  async function search(value, page = 0) {
    setCopyFeedback(null);
    const query = value.trim();
    const code = mode === 'url' ? getShortCode(query) : null;
    setError('');
    if (mode === 'url' && !code) {
      setResult(null);
      setError('Ingresa una URL corta o un código válido.');
      return;
    }
    setPending(true);
    try {
      if (mode === 'alias') {
        setResult({ ...await getAliasStats(query, page), revision });
      } else {
        setResult({ links: [await getLinkStats(code)], revision });
      }
    } catch (requestError) {
      setResult(null);
      setError(requestError.response?.status === 404
        ? (mode === 'alias' ? 'No encontramos ese alias.' : 'No encontramos ese enlace.')
        : requestMessage(requestError, 'No pudimos consultar los clics.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="click-stats-title" fullWidth maxWidth="sm">
      <DialogTitle id="click-stats-title">Consultar clics</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Tabs value={mode} onChange={(_, value) => {
            setMode(value);
            setInput('');
            setResult(null);
            setError('');
          }} aria-label="Tipo de consulta">
            <Tab label="Por URL corta" value="url" disabled={pending} />
            <Tab label="Por alias" value="alias" disabled={pending} />
          </Tabs>
          <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1}
            onSubmit={(event) => { event.preventDefault(); search(input); }}>
            <TextField fullWidth required disabled={pending} label={mode === 'alias' ? 'Alias' : 'URL corta o código'}
              value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(''); }} />
            <Button type="submit" variant="contained" disabled={pending || !input.trim()}>
              {pending ? 'Buscando…' : 'Consultar'}
            </Button>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          {result && result.revision !== revision && (
            <Alert severity="info">Vuelve a consultar para ver el estado actualizado.</Alert>
          )}
          {result?.alias && <Typography variant="subtitle1">{result.alias} · {result.totalLinks} enlaces</Typography>}
          {result?.links.length === 0 && <Typography>Esta lista no tiene enlaces en esta página.</Typography>}
          {result?.links.length > 0 && (
            <List disablePadding>
              {result.links.map((link) => (
                <ListItem key={link.shortCode} divider sx={{ flexWrap: 'wrap', gap: 1, px: 0 }}>
                  <ListItemText sx={{ minWidth: 0, flex: '1 0 100%', overflowWrap: 'anywhere' }}
                    primary={<Link href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</Link>}
                    secondary={`${link.clickCount} ${link.clickCount === 1 ? 'clic' : 'clics'} · ${link.expiresAt ? `${link.active ? 'Activo' : 'Vencido'} · ${link.expiresAt.slice(0, 16).replace('T', ' ')}` : 'Permanente'}`} />
                  <Stack direction="row" useFlexGap flexWrap="wrap">
                    <Button size="small" onClick={() => copyLink(link)}>Copiar URL</Button>
                    {link.expiresAt && result.revision === revision && (
                      <>
                        <Button size="small" onClick={() => onManage('extend', link.shortCode)}>Renovar</Button>
                        <Button size="small" color="error" onClick={() => onManage('delete', link.shortCode)}>Eliminar</Button>
                      </>
                    )}
                  </Stack>
                  {copyFeedback?.code === link.shortCode && (
                    <Typography role="status" variant="caption">{copyFeedback.message}</Typography>
                  )}
                </ListItem>
              ))}
            </List>
          )}
          {result?.totalPages > 1 && (
            <Pagination count={result.totalPages} page={result.page + 1} disabled={pending}
              onChange={(_, page) => search(result.alias, page - 1)} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cerrar</Button></DialogActions>
    </Dialog>
  );
}

ClickStats.propTypes = {
  onClose: PropTypes.func.isRequired,
  onManage: PropTypes.func.isRequired,
  revision: PropTypes.number.isRequired,
};
