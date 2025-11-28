import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/education', label: 'Education', icon: '📚' },
    { path: '/gamification', label: 'Rewards', icon: '🏆' }
  ];

  return (
    <aside style={{ 
      width: '256px', 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      height: '100vh' 
    }}>
      <nav style={{ padding: '16px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '8px' }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#2563eb' : '#374151',
                  backgroundColor: isActive ? '#dbeafe' : 'transparent'
                })}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;