const Header = ({ name }) => <h2>{name}</h2>;
const Part = ({ part }) => <li>{part.name} <strong>{part.exercises}</strong></li>;
const Content = ({ parts }) => <ul>{parts.map(part => <Part key={part.id} part={part} />)}</ul>;
const Total = ({ parts }) => <p className="number">Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p>;

export default function Course({ course }) {
  return <section aria-label={course.name}><Header name={course.name} /><Content parts={course.parts} /><Total parts={course.parts} /></section>;
}
