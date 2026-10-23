import { useEffect, useState } from 'react';
import axios from 'axios';
import { getWeather } from './services/countries.js';

export function weatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy / overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if (code >= 51 && code <= 67) return 'Drizzle / rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Weather observation';
}

export default function Weather({ country }) {
  const [result, setResult] = useState({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  const coordinates = country.capitalInfo?.latlng;
  const latitude = coordinates?.[0];
  const longitude = coordinates?.[1];
  useEffect(() => {
    if (latitude == null || longitude == null) return;
    const controller = new AbortController();
    setResult({ status: 'loading' });
    getWeather([latitude, longitude], controller.signal).then(data => setResult({ status: 'ready', data })).catch(error => {
      if (!axios.isCancel(error)) setResult({ status: 'error' });
    });
    return () => controller.abort();
  }, [latitude, longitude, retry]);
  if (latitude == null || longitude == null) return <p>Capital coordinates unavailable; weather is not requested.</p>;
  return <section aria-label="Capital weather"><h3>Weather in {country.capital?.[0]}</h3>
    {result.status === 'loading' && <p role="status">Loading weather…</p>}
    {result.status === 'error' && <p role="alert">Weather is unavailable. <button onClick={() => setRetry(value => value + 1)}>Retry weather</button></p>}
    {result.status === 'ready' && <><p>Temperature {result.data.current.temperature_2m} {result.data.current_units.temperature_2m}</p>
      <p>{weatherDescription(result.data.current.weather_code)}</p><p>Wind {result.data.current.wind_speed_10m} {result.data.current_units.wind_speed_10m}</p>
      <p className="hint">Model time: {result.data.current.time} ({result.data.timezone})</p></>}
    <p className="hint">Weather data: <a href="https://open-meteo.com/">Open-Meteo</a> · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Modelled conditions, not a sensor reading at this desk.</p>
  </section>;
}
