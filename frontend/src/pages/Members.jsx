import { useState, useEffect } from 'react';
import API from '../api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const load = () => API.get('/members').then(res => setMembers(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/members', form);
    setForm({ name: '', email: '', phone: '' });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this member?')) return;
    await API.delete(`/members/${id}`);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Members</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">Add Member</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead>
        <tbody>
          {members.map(m => (
            <tr key={m._id}>
              <td>{m.name}</td><td>{m.email}</td><td>{m.phone || '-'}</td>
              <td><button onClick={() => remove(m._id)} style={{ background: '#e74c3c' }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}