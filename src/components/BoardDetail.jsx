import React from 'react';
import {
  backgroundTypes
} from './BoardModal';

const BoardDetail = ({ board }) => {
  const bgObj = backgroundTypes.find(bg => bg.name === board.background);
  const bgImg = bgObj ? bgObj.img : undefined;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        minHeight: 420,
        height: 420,
        background: bgImg ? `url(${bgImg}) center center / cover no-repeat` : '#232323',
        borderRadius: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        background: 'rgba(24,24,24,0.82)',
        borderRadius: 20,
        padding: '32px 32px 24px 32px',
        minWidth: 320,
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
        <h1 style={{ color: '#fff', fontSize: 28, marginBottom: 32 }}>{board.title}</h1>
        <button style={{ padding: '12px 24px', background: '#232323', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: 16, marginBottom: 16 }}>
          + Add another column
        </button>
        {/* Kolonlar burada listelenecek (ileride) */}
      </div>
    </div>
  );
};

export default BoardDetail; 