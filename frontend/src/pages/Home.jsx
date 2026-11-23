import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, getStatus } from '../api.js';
import Icon from '../components/Icon.jsx';
import heroLeaf from '../assets/leaf-illustration.svg';

const features = [
  { icon: 'scan', title: 'AI Disease Detection', description: 'Upload a tomato leaf photo to check for early blight, late blight or a healthy leaf.', tone: 'mint' },
  { icon: 'shield', title: 'Crop Care Guidance', description: 'Understand symptoms, possible causes, treatment steps and prevention in simple language.', tone: 'cream' },
  { icon: 'history', title: 'Scan History', description: 'Revisit previous images and results any time, or remove scans you no longer need.', tone: 'blue' },
];

export default function Home() {
  const [status, setStatus] = useState(null);
  const [scans, setScans] = useState([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    Promise.all([getStatus(), getHistory()])
      .then(([modelStatus, history]) => { setStatus(modelStatus); setScans(history); })
      .catch(() => setOffline(true));
  }, []);

  const aiScans = scans.filter((scan) => scan.mode === 'ai');

  return (
    <div className="container page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="sparkle" size={16} /> INTELLIGENT CROP CARE</span>
          <h1>Healthier crops.<br /><span>Smarter farming.</span></h1>
          <p>Spot possible tomato leaf diseases early, learn what to do next, and keep all your crop scans in one simple place.</p>
          <div className="hero-actions">
            <Link to="/detect" className="button button-primary button-large">Start Detection <Icon name="arrow" size={19} /></Link>
            <Link to="/history" className="button button-outline button-large">View History</Link>
          </div>
          <div className="hero-proof"><span className="proof-icon"><Icon name="check" size={16} /></span> Simple tools for informed farming decisions</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-glow" />
          <img src={heroLeaf} alt="" />
          <span className="art-label art-label-top"><Icon name="shield" size={17}/> Crop care insights</span>
          <span className="art-label art-label-bottom"><Icon name="leaf" size={17}/> Tomato leaf analysis</span>
        </div>
      </section>

      {offline ? (
        <div className="notice notice-error"><Icon name="alert" size={19} /> Backend is not connected. Start FastAPI on port 8000, then refresh this page.</div>
      ) : status ? (
        <div className={`notice ${status.mode === 'ai' ? 'notice-success' : 'notice-warn'}`}>
          <Icon name={status.mode === 'ai' ? 'check' : 'info'} size={20} />
          <div><strong>{status.mode === 'ai' ? 'AI model ready' : 'Demonstration mode'}</strong><span>{status.message}</span></div>
        </div>
      ) : (
        <div className="notice"><span className="spinner spinner-small" /> Checking model status...</div>
      )}

      <section className="stats-grid" aria-label="Scan summary">
        <div className="stat-item"><div className="stat-icon"><Icon name="camera" /></div><div><strong>{scans.length}</strong><span>Total scans saved</span></div></div>
        <div className="stat-item"><div className="stat-icon"><Icon name="check" /></div><div><strong>{aiScans.length}</strong><span>AI scans completed</span></div></div>
        <div className="stat-item"><div className="stat-icon"><Icon name="leaf" /></div><div><strong>3</strong><span>Supported categories</span></div></div>
      </section>

      <section className="features-section">
        <div className="section-heading"><div><span className="section-kicker">EVERYTHING YOU NEED</span><h2>Better decisions, from one photo</h2></div><p>Three focused tools to help you look after your tomato plants.</p></div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className={`feature-icon ${feature.tone}`}><Icon name={feature.icon} size={29} /></span>
              <h3>{feature.title}</h3><p>{feature.description}</p>
              <Link to={feature.icon === 'history' ? '/history' : '/detect'} className="feature-link">{feature.icon === 'history' ? 'See history' : 'Get started'} <Icon name="arrow" size={17}/></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="bottom-cta"><div><h2>Ready to check your tomato crop?</h2><p>Upload a clear leaf photo to begin.</p></div><Link to="/detect" className="button button-light">Analyze a Leaf <Icon name="arrow" size={18}/></Link></section>
    </div>
  );
}
