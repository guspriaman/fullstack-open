import Navigation from '../../shared/Navigation.jsx';

export const Header = ({ course }) => <h1>{course}</h1>;
export const Part = ({ part }) => <p>{part.name} <strong>{part.exercises}</strong></p>;
export const Content = ({ parts }) => (
  <section aria-label="Course parts">
    <Part part={parts[0]} />
    <Part part={parts[1]} />
    <Part part={parts[2]} />
  </section>
);
export const Total = ({ parts }) => <p className="number">Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>;

export default function App() {
  const course = {
    name: 'Half Stack application development',
    parts: [
      { name: 'Fundamentals of React', exercises: 10 },
      { name: 'Using props to pass data', exercises: 7 },
      { name: 'State of a component', exercises: 14 },
    ],
  };
  return <main><Navigation /><p className="eyebrow">COURSEINFO · 1.1–1.5</p><Header course={course.name} /><Content parts={course.parts} /><Total parts={course.parts} /><footer>Final-state implementation prepared with AI tutoring assistance. Data stays in App and flows down through props.</footer></main>;
}
