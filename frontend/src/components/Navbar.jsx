import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/books', label: 'Books' },
  { to: '/members', label: 'Members' },
  { to: '/transactions', label: 'Transactions' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: '1.5rem',
      padding: '1rem 2rem', background: '#2c3e50', color: 'white'
    }}>
      <strong>📚 Library Management System</strong>
      {links.map(l => (
        <Link key={l.to} to={l.to}
          style={{ color: pathname === l.to ? '#f1c40f' : 'white', textDecoration: 'none' }}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}