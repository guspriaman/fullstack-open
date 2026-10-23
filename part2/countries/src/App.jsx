import { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from '../../shared/Navigation.jsx';
import { getAll } from './services/countries.js';
import Weather from './Weather.jsx';

function Country({ country }) {
  return <article><h2>{country.name.common}</h2><p>Capital: {country.capital?.join(', ') || 'Not listed'}</p><p>Area: {country.area.toLocaleString()} km²</p>
    <h3>Languages</h3><ul>{Object.entries(country.languages || {}).map(([code, language]) => <li key={code}>{language}</li>)}</ul>
    {country.flags?.png && <img className="flag" src={country.flags.png} alt={country.flags.alt || `Flag of ${country.name.common}`} />}
    <Weather key={country.cca3} country={country} />
  </article>;
}

export default function App() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getAll(controller.signal).then(data => { setCountries(data); setStatus('ready'); }).catch(error => {
      if (!axios.isCancel(error)) setStatus('error');
    });
    return () => controller.abort();
  }, [retry]);
  const matches = query.trim() ? countries.filter(country => country.name.common.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : [];
  const country = selected || (matches.length === 1 ? matches[0] : null);
  return <main><Navigation /><p className="eyebrow">2.18–2.20 · EXTERNAL API & EFFECTS</p><h1>Countries</h1>
    <label>Find countries<input type="search" value={query} onChange={event => { setQuery(event.target.value); setSelected(null); }} /></label>
    {status === 'loading' && <p role="status">Loading countries…</p>}
    {status === 'error' && <p role="alert">Cannot load countries. <button onClick={() => setRetry(value => value + 1)}>Retry countries</button></p>}
    {status === 'ready' && <div className="workspace">
      {!query.trim() ? <p>Type a country name to begin.</p> : country ? <Country country={country} /> : matches.length > 10 ? <p>Too many matches, specify another filter.</p> : matches.length === 0 ? <p>No matching countries.</p> :
        <ul className="people">{matches.map(item => <li key={item.cca3}><span>{item.name.common}</span><button onClick={() => setSelected(item)} aria-label={`Show ${item.name.common}`}>Show</button></li>)}</ul>}
    </div>}
    <footer>Country data: University of Helsinki Rest Countries service. Pendampingan AI diungkapkan. Cuaca diambil hanya saat satu negara ditampilkan; request lama dibatalkan ketika negara berubah.</footer>
  </main>;
}
