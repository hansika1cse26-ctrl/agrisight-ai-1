import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getScan, imageUrl } from '../api.js';
import { guidance } from '../guidance.js';
import { readableDate } from '../components/ScanCard.jsx';
import Icon from '../components/Icon.jsx';

function BulletSection({ title, items, icon }) {
  return (
    <section className="info-section"><h3><span className="info-icon"><Icon name={icon} size={20}/></span>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export default function Results() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getScan(id).then((value) => { if (!cancelled) setScan(value); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="container page center-state"><span className="spinner spinner-dark"/> Loading scan result...</div>;
  if (error) return <div className="container page center-state"><div className="inline-error">{error}</div><Link className="button button-outline" to="/history">Back to History</Link></div>;

  const isDemo = scan.mode !== 'ai';
  const info = guidance[scan.disease];
  const healthy = scan.disease === 'Healthy';

  return (
    <div className="container page results-page">
      <Link to="/history" className="back-link"><Icon name="back" size={18}/> Back to scan history</Link>
      <div className="results-heading"><div><span className="section-kicker">SCAN REPORT #{scan.id}</span><h1>Your crop analysis</h1><p>Saved on {readableDate(scan.created_at)}</p></div><Link to="/detect" className="button button-outline"><Icon name="scan" size={18}/> New Scan</Link></div>
      <div className="result-overview">
        <div className="result-image-card"><img src={imageUrl(scan.image_url)} alt="Uploaded tomato leaf for this scan" /></div>
        <div className="result-summary-card">
          <span className={`pill ${isDemo ? 'pill-warn' : healthy ? 'pill-success' : 'pill-alert'}`}>{isDemo ? 'DEMO MODE' : healthy ? 'HEALTHY LEAF' : 'POSSIBLE DISEASE'}</span>
          <div className="summary-icon"><Icon name={isDemo ? 'info' : healthy ? 'check' : 'alert'} size={31}/></div>
          <span className="summary-label">{isDemo ? 'Model status' : 'AI classification'}</span>
          <h2>{isDemo ? 'Not analyzed by AI' : scan.disease}</h2>
          <p>{isDemo ? 'A trained AI model is not currently available. This is a saved demonstration scan, not a disease diagnosis.' : healthy ? 'A healthy-looking leaf is a great sign. Keep up good crop care!' : 'Look over the guidance below and check other leaves for symptoms.'}</p>
          {!isDemo && (
            <div className="confidence"><div className="confidence-row"><strong>Model confidence</strong><strong>{scan.confidence.toFixed(1)}%</strong></div><div className="confidence-track"><div style={{ width: `${Math.max(0, Math.min(100, scan.confidence))}%` }}/></div><span>Confidence is not the same as a guaranteed diagnosis.</span></div>
          )}
        </div>
      </div>
      {isDemo ? (
        <section className="explanation-card"><h2>How to enable real AI detection</h2><p>Download the three Tomato PlantVillage categories, put them into <code>backend/dataset/</code>, run <code>python train_model.py</code> from the backend folder, and restart FastAPI. See README.md for full instructions.</p><div className="notice notice-warn"><Icon name="info" size={19}/> No predicted disease or confidence has been recorded for this scan.</div></section>
      ) : info ? (
        <section className="explanation-card"><div className="explanation-header"><span className="section-kicker">UNDERSTAND YOUR RESULT</span><h2>{healthy ? 'Keep your plants thriving' : `About ${scan.disease}`}</h2><p>{info.description}</p></div><div className="info-grid"><BulletSection title="Common symptoms" items={info.symptoms} icon="photo"/><BulletSection title="Possible causes" items={info.causes} icon="info"/><BulletSection title={healthy ? 'Recommended care' : 'Recommended treatment'} items={info.treatment} icon="shield"/><BulletSection title="Prevention tips" items={info.prevention} icon="leaf"/></div></section>
      ) : (
        <div className="notice notice-warn">No guidance is available for this prediction. Consult a local agricultural adviser.</div>
      )}
      <p className="disclaimer"><Icon name="info" size={17}/> This application is an educational screening aid, not a laboratory diagnosis. Ask a local crop specialist before applying pesticides or removing large amounts of crop.</p>
    </div>
  );
}
