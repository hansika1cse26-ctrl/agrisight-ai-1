import { Link } from 'react-router-dom';
import { imageUrl } from '../api.js';
import Icon from './Icon.jsx';

export function readableDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium', timeStyle: 'short',
  });
}

export default function ScanCard({ scan, onDelete, deleting }) {
  const isDemo = scan.mode !== 'ai';
  return (
    <article className="history-card">
      <Link to={`/results/${scan.id}`} className="history-image-link" aria-label={`View scan ${scan.id}`}>
        <img src={imageUrl(scan.image_url)} alt="Previously uploaded tomato leaf" />
      </Link>
      <div className="history-content">
        <span className={`pill ${isDemo ? 'pill-warn' : scan.disease === 'Healthy' ? 'pill-success' : 'pill-alert'}`}>
          {isDemo ? 'Demo · Not analyzed' : scan.disease}
        </span>
        <h3>{isDemo ? 'Demonstration Scan' : scan.disease}</h3>
        <p className="muted"><Icon name="clock" size={15} /> {readableDate(scan.created_at)}</p>
        <p className="muted small">{isDemo ? 'No AI confidence score' : `${scan.confidence.toFixed(1)}% confidence`}</p>
        <div className="history-actions">
          <Link className="text-link" to={`/results/${scan.id}`}>View result <Icon name="arrow" size={16} /></Link>
          {onDelete && (
            <button type="button" className="delete-button" onClick={() => onDelete(scan.id)}
              disabled={deleting} aria-label={`Delete scan ${scan.id}`}>
              <Icon name="trash" size={17} /> Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
