import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatus, predictImage } from '../api.js';
import Icon from '../components/Icon.jsx';

const MAX_BYTES = 8 * 1024 * 1024;

export default function Detect() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getStatus().then(setStatus).catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(nextFile) {
    setError('');
    if (!nextFile) return;
    const extension = nextFile.name.split('.').pop()?.toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(extension) || (nextFile.type && !['image/jpeg', 'image/png'].includes(nextFile.type))) {
      setFile(null);
      setError('Choose a valid JPG, JPEG, or PNG image.');
      return;
    }
    if (nextFile.size > MAX_BYTES) {
      setFile(null);
      setError('Choose an image smaller than 8 MB.');
      return;
    }
    setFile(nextFile);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    if (!loading) chooseFile(event.dataTransfer.files?.[0]);
  }

  async function analyze(event) {
    event.preventDefault();
    if (!file || loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await predictImage(file);
      navigate(`/results/${result.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="container page narrow-page">
      <div className="page-intro"><span className="section-kicker">CROP DISEASE DETECTION</span><h1>Analyze your tomato leaf</h1><p>Upload a clear photograph of a single tomato leaf. Our trained AI model, when available, can suggest one of three classifications.</p></div>
      {status?.mode === 'demo' && (
        <div className="notice notice-warn"><Icon name="info" size={20}/><div><strong>Demonstration mode</strong><span>No trained model is installed. Your scan will be saved, but no disease prediction or confidence will be generated.</span></div></div>
      )}
      <div className="upload-layout">
        <form className="upload-card" onSubmit={analyze}>
          <div className="card-topline"><span className="step-number">01</span><div><h2>Upload leaf image</h2><p>Select a file or drag it into the area below.</p></div></div>
          <input ref={inputRef} type="file" className="visually-hidden" accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ''; }} aria-label="Choose tomato leaf image" />
          <div className={`dropzone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
            role="button" tabIndex={0} aria-label="Click or drop an image to upload"
            onClick={() => !loading && inputRef.current?.click()}
            onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !loading) { event.preventDefault(); inputRef.current?.click(); } }}
            onDragOver={(event) => { event.preventDefault(); if (!loading) setDragging(true); }}
            onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            {preview ? (
              <><img src={preview} alt="Selected tomato leaf preview" className="image-preview"/><span className="change-image"><Icon name="camera" size={16}/> Click to change image</span></>
            ) : (
              <><span className="upload-icon"><Icon name="upload" size={31}/></span><strong>Drag & drop your leaf image here</strong><span>or click to browse your files</span><span className="file-hint">JPG, JPEG or PNG · Maximum 8 MB</span></>
            )}
          </div>
          {file && <div className="selected-file"><Icon name="photo" size={19}/><span>{file.name}</span><button type="button" className="icon-button" aria-label="Remove selected image" onClick={() => setFile(null)} disabled={loading}><Icon name="x" size={17}/></button></div>}
          {error && <div className="inline-error" role="alert"><Icon name="alert" size={18}/>{error}</div>}
          <button type="submit" disabled={!file || loading} className="button button-primary analyze-button">
            {loading ? <><span className="spinner"/> Analyzing image...</> : <><Icon name="scan" size={20}/> Analyze Crop <Icon name="arrow" size={19}/></>}
          </button>
          <p className="form-footnote">{loading ? 'Processing your photo. The first AI prediction may load slowly.' : 'Images are stored locally on your backend computer.'}</p>
        </form>
        <aside className="tips-card"><span className="feature-icon mint"><Icon name="camera" size={26}/></span><h3>Tips for a good photo</h3><ul className="tips-list"><li><Icon name="check" size={17}/> Use bright, natural lighting.</li><li><Icon name="check" size={17}/> Keep the leaf in focus.</li><li><Icon name="check" size={17}/> Show the entire leaf if possible.</li><li><Icon name="check" size={17}/> Avoid busy backgrounds.</li></ul><div className="tip-note"><Icon name="info" size={19}/><span>This tool is for tomato leaves only. Results are educational and should be confirmed before treatment.</span></div></aside>
      </div>
    </div>
  );
}
