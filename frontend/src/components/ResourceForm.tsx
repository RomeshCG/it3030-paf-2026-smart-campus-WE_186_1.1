import React, { useState, useEffect } from 'react';
import { type ResourceDTO, ResourceStatuses, ResourceTypes } from '../types/resource';
import { createResource, updateResource } from '../api/resourceApi';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  resource?: ResourceDTO;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResourceForm: React.FC<Props> = ({ resource, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ResourceDTO>({
    name: '',
    type: ResourceTypes.LAB,
    capacity: 10,
    location: '',
    status: ResourceStatuses.ACTIVE,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    }
  }, [resource]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (resource?.id) {
        await updateResource(resource.id, formData);
        toast.success('Resource updated successfully!');
      } else {
        await createResource(formData);
        toast.success('Resource added successfully!');
      }
      onSuccess();
    } catch (err: any) {
      toast.error('Failed to save resource. ' + (err.response?.data?.error || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ background: 'var(--bg-secondary)', padding: '2rem' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Computing Lab 01"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                {Object.values(ResourceTypes).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                {Object.values(ResourceStatuses).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                name="capacity"
                className="form-control"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
              />
              {errors.capacity && <div className="error-text">{errors.capacity}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Building A, Floor 2"
              />
              {errors.location && <div className="error-text">{errors.location}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <input
              type="text"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
