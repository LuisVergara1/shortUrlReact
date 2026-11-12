import { useState } from 'react';
import PropTypes from 'prop-types';
import data from '../../data.json';

const icons = ['↗', '⌘', '▤', '▣'];
const tones = ['pink', 'green', 'blue', 'violet'];

export default function ListUrl({ shortUrlBase }) {
  const [visible, setVisible] = useState(true);

  return (
    <section className="examples" aria-labelledby="examples-title">
      <div className="examples-header">
        <div>
          <h2 id="examples-title">Enlaces de ejemplo</h2>
          <p>Abre el portafolio, la documentación o el código del proyecto.</p>
        </div>
        <button type="button" aria-expanded={visible} aria-controls="examples-grid"
          onClick={() => setVisible(!visible)}>
          {visible ? 'Ocultar ejemplos' : 'Mostrar ejemplos'}
        </button>
      </div>
      <div id="examples-grid" className="examples-grid" hidden={!visible}>
        {data.map(({ name, url, code }, index) => {
          const href = shortUrlBase ? shortUrlBase + code : url;
          return (
            <a key={name} className={`example-link tone-${tones[index]}`} href={href} target="_blank" rel="noreferrer">
              <span className="example-icon" aria-hidden="true">{icons[index]}</span>
              <span className="example-copy"><strong>{name}</strong><small>{shortUrlBase ? href : new URL(url).hostname}</small></span>
              <span className="example-arrow" aria-hidden="true">↗</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
ListUrl.propTypes = { shortUrlBase: PropTypes.string };
