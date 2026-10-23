import { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from '../../shared/Navigation.jsx';
import Notification, { useNotification } from '../../shared/Notification.jsx';
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Persons from './components/Persons.jsx';
import createDirectoryService from './services/persons.js';

const services = { persons: createDirectoryService('persons'), contacts: createDirectoryService('contacts') };
const normalized = name => name.trim().toLocaleLowerCase();

export default function App({ resource = 'persons', lab = false }) {
  const service = services[resource];
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [notice, notify] = useNotification();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    service.getAll(controller.signal).then(data => {
      setPersons(data);
      setLoading(false);
    }).catch(error => {
      if (axios.isCancel(error)) return;
      setLoadError(true);
      setLoading(false);
    });
    return () => controller.abort();
  }, [service, revision]);

  function reportFailure(error, person) {
    if (error.response?.status === 404 && person) {
      setPersons(current => current.filter(item => item.id !== person.id));
      notify(`${person.name} was already removed from the server. The local list has been updated.`, 'error');
    } else notify('The operation failed. Changes have not been confirmed by the server. Please retry.', 'error');
  }

  async function save(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanNumber = number.trim();
    if (busy || loading || loadError) return;
    if (!cleanName || !cleanNumber) { notify('Name and number are required.', 'error'); return; }
    const existing = persons.find(person => normalized(person.name) === normalized(cleanName));
    if (existing && existing.number === cleanNumber) {
      window.alert(`${existing.name} is already added to phonebook`);
      return;
    }
    if (existing && !window.confirm(`${existing.name} is already added. Replace the old number with a new one?`)) return;
    setBusy(true);
    try {
      if (existing) {
        const saved = await service.update(existing.id, { ...existing, number: cleanNumber });
        setPersons(current => current.map(person => person.id === saved.id ? saved : person));
        notify(`Updated ${saved.name}`);
      } else {
        const saved = await service.create({ name: cleanName, number: cleanNumber });
        setPersons(current => current.concat(saved));
        notify(`Added ${saved.name}`);
      }
      setName(''); setNumber('');
    } catch (error) { reportFailure(error, existing); }
    finally { setBusy(false); }
  }

  async function remove(person) {
    if (busy || !window.confirm(`Delete ${person.name}? This affects only this local practice directory.`)) return;
    setBusy(true);
    try {
      await service.remove(person.id);
      setPersons(current => current.filter(item => item.id !== person.id));
      notify(`Deleted ${person.name}`);
    } catch (error) { reportFailure(error, person); }
    finally { setBusy(false); }
  }

  const visiblePersons = persons.filter(person => normalized(person.name).includes(normalized(filter)));
  return <main><Navigation /><p className="eyebrow">{lab ? 'LAB BREWTICA · DATA SIMULASI' : '2.6–2.17 · FORMS & HTTP'}</p>
    <h1>{lab ? 'Buku pemasok kedai' : 'Phonebook'}</h1>
    <p>{lab ? 'Latihan mandiri dengan pemasok fiktif. Tidak terhubung ke Brewtica produksi.' : 'Data contoh latihan. Jangan masukkan kontak pribadi.'}</p>
    {lab && <aside><h2>Dari formulir ke server</h2><ol><li>Ketik nama → onChange memperbarui state.</li><li>Simpan → POST dikirim ke server lokal.</li><li>Server mengembalikan data + ID → state dan DOM diperbarui.</li><li>Reload → GET mengambil data yang sudah tersimpan.</li></ol><p>Filter memakai state lokal; mengetik filter tidak mengirim HTTP baru.</p></aside>}
    <Notification notice={notice} />
    {loading && <p role="status">Loading contacts…</p>}
    {loadError && <div role="alert" className="notification error">Cannot load contacts. Start npm run server on port 3001. <button onClick={() => setRevision(current => current + 1)}>Retry loading</button></div>}
    <div className="columns workspace"><section><h2>Add a new contact</h2>
      <PersonForm name={name} number={number} onNameChange={event => setName(event.target.value)} onNumberChange={event => setNumber(event.target.value)} onSubmit={save} disabled={busy || loading || loadError} />
    </section><section><h2>Numbers</h2><Filter value={filter} onChange={event => setFilter(event.target.value)} />
      {!loading && !loadError && <Persons persons={visiblePersons} onDelete={remove} disabled={busy} />}
    </section></div>
    <footer>Data disimpan di .data/db.json pada server lokal. Pendampingan AI diungkapkan; peserta tetap perlu memahami dan mereview source.</footer>
  </main>;
}
