import { useEffect, useRef, useState } from 'react';

export function useNotification() {
  const [notice, setNotice] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function notify(text, type = 'success') {
    clearTimeout(timer.current);
    setNotice({ text, type });
    timer.current = setTimeout(() => setNotice(null), 5000);
  }
  return [notice, notify];
}

export default function Notification({ notice }) {
  if (!notice) return null;
  return <div className={`notification ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</div>;
}
