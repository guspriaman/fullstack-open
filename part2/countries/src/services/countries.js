import axios from 'axios';

export const getAll = signal => axios.get('https://studies.cs.helsinki.fi/restcountries/api/all', { signal }).then(response => response.data);
export const getWeather = (coordinates, signal) => axios.get('https://api.open-meteo.com/v1/forecast', {
  signal,
  params: { latitude: coordinates[0], longitude: coordinates[1], current: 'temperature_2m,wind_speed_10m,weather_code', timezone: 'auto' },
}).then(response => response.data);
