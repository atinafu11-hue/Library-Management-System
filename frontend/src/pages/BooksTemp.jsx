import { useState, useEffect } from 'react';
import API from '../api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', totalCopies: 1 });

  const load = () => API.get('/books').then(res => setBooks(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/books', { ...form, availableCopies: form.totalCopies });
    setForm({ title: '', author: '', genre: '', totalCopies: 1 });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this book?')) return;
    await API.delete(`/books/${id}`);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Books</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
        <input placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
        <input type="number" min="1" placeholder="Copies" value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: +e.target.value })} />
        <button type="submit">Add Book</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Available</th><th>Action</th></tr></thead>
        <tbody>
          {books.map(b => (
            <tr key={b._id}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.genre || '-'}</td>
              <td>{b.availableCopies}/{b.totalCopies}</td>
              <td><button onClick={() => remove(b._id)} style={{ background: '#e74c3c' }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}