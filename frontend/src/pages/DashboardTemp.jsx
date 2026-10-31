import { useState, useEffect } from 'react';
import API from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, activeLoans: 0, overdue: 0, fines: 0 });

  useEffect(() => {
    (async () => {
      const [books, members, transactions] = await Promise.all([
        API.get('/books'),
        API.get('/members'),
        API.get('/transactions')
      ]);
      const activeLoans = transactions.data.filter(t => t.status === 'borrowed').length;
      const overdue = transactions.data.filter(t =>
        t.status === 'borrowed' && new Date(t.dueDate) < new Date()
      ).length;
      const fines = transactions.data.reduce((sum, t) => sum + (t.fine || 0), 0);
      setStats({ books: books.data.length, members: members.data.length, activeLoans, overdue, fines });
    })();
  }, []);

  const card = (label, value, color) => (
    <div style={{ background: color, color: 'white', padding: '1.2rem', borderRadius: '8px' }}>
      <h3 style={{ fontSize: '0.9rem', opacity: 0.9 }}>{label}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {card('Total Books', stats.books, '#3498db')}
        {card('Members', stats.members, '#2ecc71')}
        {card('Active Loans', stats.activeLoans, '#f39c12')}
        {card('Overdue', stats.overdue, '#e74c3c')}
        {card('Fines (₹)', stats.fines, '#9b59b6')}
      </div>
    </div>
  );
}