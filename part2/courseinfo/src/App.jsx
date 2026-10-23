import Course from './Course.jsx';
import Navigation from '../../shared/Navigation.jsx';

export const courses = [
  { id: 1, name: 'Half Stack application development', parts: [
    { id: 1, name: 'Fundamentals of React', exercises: 10 },
    { id: 2, name: 'Using props to pass data', exercises: 7 },
    { id: 3, name: 'State of a component', exercises: 14 },
    { id: 4, name: 'Redux', exercises: 11 },
  ] },
  { id: 2, name: 'Node.js', parts: [
    { id: 1, name: 'Routing', exercises: 3 },
    { id: 2, name: 'Middlewares', exercises: 7 },
  ] },
];

export default function App() {
  return <main><Navigation /><p className="eyebrow">2.1–2.5 · COLLECTIONS & MODULES</p><h1>Web development curriculum</h1>
    <p>map mengubah setiap data menjadi komponen. reduce menjumlahkan latihan. key memakai ID yang stabil.</p>
    <div className="columns">{courses.map(course => <Course key={course.id} course={course} />)}</div>
    <footer>Disiapkan dengan pendampingan AI untuk dipelajari dan direview.</footer></main>;
}
