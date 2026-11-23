import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteScan, getHistory } from '../api.js';
import ScanCard from '../components/ScanCard.jsx';
import Icon from '../components/Icon.jsx';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getHistory().then(setScans).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this scan and its saved image? This cannot be undone.')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteScan(id);
      setScans((current) => current.filter((scan) => scan.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container page history-page">
      <div className="results-heading"><div><span className="section-kicker">YOUR SCAN HISTORY</span><h1>Previous crop scans</h1><p>Review saved photos and results, or delete records you no longer need.</p></div><Link to="/detect" className="button button-primary"><Icon name="scan" size={18}/> New Scan</Link></div>
      <div className="history-toolbar"><span><Icon name="history" size={19}/> {scans.length} saved {scans.length === 1 ? 'scan' : 'scans'}</span><span>Newest first</span></div>
      {error && <div className="inline-error" role="alert"><Icon name="alert" size={18}/>{error}</div>}
      {loading ? (
        <div className="center-state"><span className="spinner spinner-dark"/> Loading history...</div>
      ) : scans.length === 0 ? (
        <div className="empty-state"><span className="empty-icon"><Icon name="photo" size={39}/></span><h2>No scans yet</h2><p>Your uploaded leaf images and scan results will appear here.</p><Link to="/detect" className="button button-primary">Start your first scan <Icon name="arrow" size={18}/></Link></div>
      ) : (
        <div className="history-grid">{scans.map((scan) => <ScanCard key={scan.id} scan={scan} onDelete={handleDelete} deleting={deletingId !== null}/>)}</div>
      )}
    </div>
  );
}
