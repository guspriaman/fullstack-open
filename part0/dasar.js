const comparison = document.querySelector('#ubah-tampilan');
const card = document.querySelector('#kartu-demo');
comparison.addEventListener('click', () => {
  const changed = card.classList.toggle('alternatif');
  comparison.setAttribute('aria-pressed', String(changed));
});
