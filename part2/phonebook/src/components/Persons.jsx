export default function Persons({ persons, onDelete, disabled }) {
  if (!persons.length) return <p>No matching contacts.</p>;
  return <ul className="people">{persons.map(person => <li key={person.id}>
    <span><strong>{person.name}</strong><br />{person.number}</span>
    <button className="secondary" onClick={() => onDelete(person)} disabled={disabled} aria-label={`Delete ${person.name}`}>Delete</button>
  </li>)}</ul>;
}
