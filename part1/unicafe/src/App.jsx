import { useState } from 'react';
import Navigation from '../../shared/Navigation.jsx';

export const Button = ({ onClick, text }) => <button type="button" onClick={onClick}>{text}</button>;
export const StatisticLine = ({ text, value }) => <tr><th scope="row">{text}</th><td>{value}</td></tr>;
export function Statistics({ good, neutral, bad }) {
  const all = good + neutral + bad;
  if (all === 0) return <p>No feedback given</p>;
  const average = (good - bad) / all;
  const positive = good / all * 100;
  return <table><caption>Feedback statistics</caption><tbody>
    <StatisticLine text="good" value={good} />
    <StatisticLine text="neutral" value={neutral} />
    <StatisticLine text="bad" value={bad} />
    <StatisticLine text="all" value={all} />
    <StatisticLine text="average" value={average.toFixed(2)} />
    <StatisticLine text="positive" value={`${positive.toFixed(1)} %`} />
  </tbody></table>;
}
export default function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  return <main><Navigation /><p className="eyebrow">UNICAFE · 1.6–1.11</p><h1>give feedback</h1>
    <div className="actions"><Button text="good" onClick={() => setGood(value => value + 1)} /><Button text="neutral" onClick={() => setNeutral(value => value + 1)} /><Button text="bad" onClick={() => setBad(value => value + 1)} /></div>
    <section><h2>statistics</h2><Statistics good={good} neutral={neutral} bad={bad} /></section>
    <footer>State lives in App. Average and positive percentage are calculated from that state. Feedback lasts until reload. Prepared with AI tutoring assistance.</footer>
  </main>;
}
