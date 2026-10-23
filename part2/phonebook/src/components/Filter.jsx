export default function Filter({ value, onChange }) {
  return <label>Filter by name<input value={value} onChange={onChange} type="search" /></label>;
}
