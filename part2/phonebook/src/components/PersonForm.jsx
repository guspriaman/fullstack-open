export default function PersonForm({ name, number, onNameChange, onNumberChange, onSubmit, disabled }) {
  return <form onSubmit={onSubmit}>
    <label>Name<input value={name} onChange={onNameChange} required maxLength={100} /></label>
    <label>Number<input value={number} onChange={onNumberChange} required maxLength={50} /></label>
    <button type="submit" disabled={disabled}>Add / update</button>
  </form>;
}
