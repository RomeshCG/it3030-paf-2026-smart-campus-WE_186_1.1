import React from 'react';
import { type ResourceDTO } from '../types/resource';
import { X, MapPin, Users, Activity, Download, ExternalLink } from 'lucide-react';

interface Props {
  resource: ResourceDTO;
  onClose: () => void;
}

export const ResourceDetails: React.FC<Props> = ({ resource, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ background: 'var(--bg-secondary)', padding: '2rem', maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{resource.name} Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="details-body">
          <div className="image-container" style={{ height: '250px', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
            {resource.imageUrl ? (
              <img src={resource.imageUrl} alt={resource.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="placeholder-img" style={{ fontSize: '3rem' }}>{resource.name.charAt(0)}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="detail-item">
              <label className="form-label">Type</label>
              <span className={`badge type-badge badge-${resource.type.toLowerCase()}`}>{resource.type}</span>
            </div>
            <div className="detail-item">
              <label className="form-label">Status</label>
              <span className={`badge badge-${resource.status.toLowerCase()}`}>{resource.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="detail-row" style={{ marginBottom: '1rem' }}>
            <MapPin size={20} style={{ color: 'var(--text-secondary)' }}/>
            <span style={{ fontSize: '1.1rem' }}>{resource.location}</span>
          </div>

          <div className="detail-row" style={{ marginBottom: '1.5rem' }}>
            <Users size={20} style={{ color: 'var(--accent-color)' }}/>
            <span style={{ fontSize: '1.1rem' }}>Capacity: <strong>{resource.capacity}</strong> persons</span>
          </div>

          {resource.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Description</label>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{resource.description}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {resource.downloadUrl && (
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => window.open(resource.downloadUrl, '_blank')}
              >
                <Download size={18} /> Download Resource
              </button>
            )}
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
