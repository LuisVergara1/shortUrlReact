import { useContext, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalContext } from './Mobal/ModalContext.jsx';
import ErrorMobal from './Mobal/ErrorMobal';
import ListUrl from './EndPoint/ListUrl.jsx';
import LinkAction from './EndPoint/LinkAction.jsx';
import ClickStats from './EndPoint/ClickStats.jsx';
import { getLinkConfig } from '../services/UrlService';

function formatDuration(minutes) {
  const units = [
    [1440, 'día', 'días'],
    [60, 'hora', 'horas'],
    [1, 'minuto', 'minutos'],
  ];
  return units.flatMap(([size, singular, plural]) => {
    const amount = Math.floor(minutes / size);
    minutes %= size;
    return amount ? [`${amount} ${amount === 1 ? singular : plural}`] : [];
  }).join(' ');
}

const actions = [
  { action: 'create', title: 'Crear URL', label: 'Crear URL', icon: '↗', color: 'pink',
    description: 'Convierte una dirección larga en un enlace fácil de compartir.' },
  { action: 'custom', title: 'URL personalizada', label: 'Personalizar URL', icon: '✎', color: 'violet',
    description: 'Elige un código corto que puedas recordar.' },
  { action: 'extend', title: 'Renovar URL', label: 'Renovar URL', icon: '↻', color: 'blue',
    description: 'Amplía la vigencia de un enlace temporal.' },
  { action: 'delete', title: 'Eliminar URL', label: 'Eliminar URL', icon: '×', color: 'red',
    description: 'Borra un enlace que ya no necesitas.' },
];

export default function URLManager() {
  const { isExpiredModalOpen, showExpiredModal, hideExpiredModal } = useContext(ModalContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const duration = config ? formatDuration(config.linkTtlMinutes) : '';
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getLinkConfig(controller.signal).then(setConfig).catch(() => {
      // The page can still render when the API is unavailable.
    });
    return () => controller.abort();
  }, []);
  const [helpOpen, setHelpOpen] = useState(false);
  const [operation, setOperation] = useState(null);
  const [statsRevision, setStatsRevision] = useState(0);

  useEffect(() => {
    if (location.pathname === '/url_not_found') showExpiredModal();
  }, [location.pathname, showExpiredModal]);

  function closeExpiredModal() {
    hideExpiredModal();
    navigate('/');
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#inicio">
            <span className="brand-mark" aria-hidden="true"><i /><i /></span>
            <span>Link<span className="brand-accent">Slice</span></span>
          </a>
          <nav className="site-nav" aria-label="Navegación principal">
            <button type="button" onClick={() => setOperation({ action: 'create' })}>Crear URL</button>
            <button type="button" onClick={() => setStatsOpen(true)}>Consultar clics</button>
            <button type="button" onClick={() => setHelpOpen(true)}>Ayuda</button>
          </nav>
        </div>
      </header>
      <main id="inicio" className="site-main">
        <section className="hero" aria-labelledby="site-title">
          <h1 id="site-title">Link<span>Slice</span></h1>
          <p>Acorta, personaliza y gestiona tus URLs sin crear una cuenta.</p>
        </section>
        <ListUrl shortUrlBase={config?.shortUrlBase} />
        <section className="action-grid" aria-label="Gestionar enlaces">
          {actions.map(({ action, title, label, icon, color, description }) => (
            <article key={action} className={`action-card tone-${color}`}>
              <span className="action-icon" aria-hidden="true">{icon}</span>
              <h2>{title}</h2>
              <p>{description}</p>
              <button type="button" className="action-button" onClick={() => setOperation({ action })}>
                {label} <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </section>
        <p className="expiration-note"><span aria-hidden="true">ⓘ</span> {duration ? `Los enlaces temporales vencen en ${duration} y puedes renovarlos.` : 'Puedes renovar los enlaces temporales.'}</p>
      </main>
      {statsOpen && <ClickStats onClose={() => setStatsOpen(false)} revision={statsRevision}
        onManage={(action, initialLink) => setOperation({ action, initialLink })} />}
      {operation && <LinkAction {...operation} duration={duration} onClose={() => setOperation(null)}
        onSuccess={() => setStatsRevision((revision) => revision + 1)} />}
      {isExpiredModalOpen && <ErrorMobal onClose={closeExpiredModal} />}
      {helpOpen && (
        <Dialog open onClose={() => setHelpOpen(false)} aria-labelledby="help-title" fullWidth maxWidth="sm">
          <DialogTitle id="help-title">Ayuda</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography><strong>Con alias.</strong> Usa la clave de tu lista para agregar, renovar o eliminar enlaces.</Typography>
              <Typography><strong>Sin alias.</strong> El navegador guarda una clave por enlace. Puedes copiarla para gestionarlo desde otro dispositivo.</Typography>
              <Typography><strong>Consultar clics.</strong> Busca por URL corta o por alias. La consulta es pública.</Typography>
            </Stack>
          </DialogContent>
          <DialogActions><Button onClick={() => setHelpOpen(false)}>Cerrar</Button></DialogActions>
        </Dialog>
      )}
    </div>
  );
}
