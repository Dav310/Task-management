import React from 'react';
import { List, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatsCard = ({ title, value, icon, color = 'var(--text-dark)' }) => {
  const getIcon = () => {
    switch (icon) {
      case 'list': return <List size={24} />;
      case 'check': return <CheckCircle size={24} />;
      case 'clock': return <Clock size={24} />;
      case 'alert': return <AlertCircle size={24} />;
      default: return null;
    }
  };

  return (
    <div className="neumorph-card" style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
      <div style={{ color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
        {getIcon()}
      </div>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{value}</h2>
      <p style={{ fontSize: '0.875rem', fontWeight: '600', opacity: 0.8 }}>{title}</p>
    </div>
  );
};

export default StatsCard;
