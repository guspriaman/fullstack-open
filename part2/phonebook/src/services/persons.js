import axios from 'axios';

// Only the two isolated local resources are selectable by the lab.
export default function createDirectoryService(resource = 'persons') {
  if (!['persons', 'contacts'].includes(resource)) throw new Error('Unknown lab resource');
  const base = `http://127.0.0.1:3001/${resource}`;
  return {
    getAll: signal => axios.get(base, { signal }).then(response => response.data),
    create: person => axios.post(base, person).then(response => response.data),
    update: (id, person) => axios.put(`${base}/${encodeURIComponent(id)}`, person).then(response => response.data),
    remove: id => axios.delete(`${base}/${encodeURIComponent(id)}`).then(response => response.data),
  };
}
