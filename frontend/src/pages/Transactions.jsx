import { useState, useEffect } from 'react';
import API from '../api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowForm, setBorrowForm] = useState({ bookId: '', memberId: '' });

  const load = async () => {
    const [t, b, m] = await Promise.all([
      API.get('/transactions'), API.get('/books'), API.get('/members')
    ]);
    setTransactions(t.data); setBooks(b.data); setMembers(m.data);
  };
  useEffect(() => { load(); }, []);

  const borrow = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions/borrow', borrowForm);
      setBorrowForm({ bookId: '', memberId: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Borrow failed');
    }
  };

  const returnBook = async (id) => {
    await API.post(`/transactions/return/${id}`);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Transactions</h1>

      <form onSubmit={borrow} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={borrowForm.bookId} onChange={e => setBorrowForm({ ...borrowForm, bookId: e.target.value })} required>
          <option value="">Select book</option>
          {books.filter(b => b.availableCopies > 0).map(b => (
            <option key={b._id} value={b._id}>{b.title} ({b.availableCopies} left)</option>
          ))}
        </select>
        <select value={borrowForm.memberId} onChange={e => setBorrowForm({ ...borrowForm, memberId: e.target.value })} required>
          <option value="">Select member</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
        </select>
        <button type="submit">Borrow Book</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Book</th><th>Member</th><th>Borrowed</th><th>Due</th>
            <th>Returned</th><th>Fine (₹)</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => {
            const overdue = t.status === 'borrowed' && new Date(t.dueDate) < new Date();
            return (
              <tr key={t._id}>
                <td>{t.book?.title}</td>
                <td>{t.member?.name}</td>
                <td>{new Date(t.borrowDate).toLocaleDateString()}</td>
                <td style={{ color: overdue ? '#e74c3c' : 'inherit', fontWeight: overdue ? 'bold' : 'normal' }}>
                  {new Date(t.dueDate).toLocaleDateString()}
                </td>
                <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                <td>{t.fine}</td>
                <td>{t.status}{overdue ? ' ⚠️ overdue' : ''}</td>
                <td>
                  {t.status === 'borrowed' && (
                    <button onClick={() => returnBook(t._id)} style={{ background: '#2ecc71' }}>Return</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}