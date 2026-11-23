import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Detect from './pages/Detect.jsx';
import Results from './pages/Results.jsx';
import History from './pages/History.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<div className="container page"><h1>Page not found</h1><a href="/">Return to dashboard</a></div>} />
        </Routes>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><span>© {new Date().getFullYear()} AgriSightAI · Growing smarter together.</span><span>Educational tool · Always verify field diagnoses</span></div></footer>
    </BrowserRouter>
  );
}
