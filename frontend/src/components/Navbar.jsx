import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="AgriSightAI home">
          <span className="brand-icon"><Icon name="leaf" size={25} /></span>
          <span>AgriSight<span className="brand-accent">AI</span></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/detect" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Detect Disease</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Scan History</NavLink>
        </div>
        <Link to="/detect" className="button button-primary nav-cta">
          <Icon name="scan" size={17} /> Scan Leaf
        </Link>
      </nav>
    </header>
  );
}
