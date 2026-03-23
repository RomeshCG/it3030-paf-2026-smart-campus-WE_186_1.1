import React, { useState, useEffect } from 'react';
import { type ResourceDTO, ResourceTypes, ResourceStatuses } from '../types/resource';
import { getResources, deleteResource } from '../api/resourceApi';
import { ResourceForm } from './ResourceForm';
import { Plus, Edit2, Trash2, MapPin, Users, Activity, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResourceList: React.FC = () => {
  const [resources, setResources] = useState<ResourceDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | ''>('');
  const [size] = useState(6); // cards per page

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceDTO | undefined>();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getResources({
        page,
        size,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        capacity: capacityFilter || undefined
      });
      setResources(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page, typeFilter, statusFilter, capacityFilter]);

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(id);
      toast.success('Resource deleted securely.');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete resource.');
    }
  };

  const handleEdit = (resource: ResourceDTO) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingResource(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchResources();
  };

  return (
    <div className="container">
      <h1 className="page-title">Facilities & Assets Catalogue</h1>
      
      {/* Tools & Filters Section */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div className="filters-panel">
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label"><Layers size={14} style={{ display: 'inline', marginRight: '6px' }}/> Filter by Type</label>
            <select className="form-control" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}>
              <option value="">All Types</option>
              {Object.values(ResourceTypes).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label"><Activity size={14} style={{ display: 'inline', marginRight: '6px' }}/> Filter by Status</label>
            <select className="form-control" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
              <option value="">All Statuses</option>
              {Object.values(ResourceStatuses).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label"><Users size={14} style={{ display: 'inline', marginRight: '6px' }}/> Min Capacity</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 20"
              value={capacityFilter}
              onChange={(e) => { setCapacityFilter(parseInt(e.target.value) || ''); setPage(0); }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => {
              setTypeFilter(''); setStatusFilter(''); setCapacityFilter(''); setPage(0);
            }}>
              <RefreshCw size={16} /> Reset
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              <Plus size={18} /> Add Resource
            </button>
          </div>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-color)' }}>Loading resources...</div>}

      {!loading && resources.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Layers size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h3>No resources found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or adding a new resource.</p>
        </div>
      )}

      {/* Grid */}
      <div className="resource-grid">
        {resources.map((res) => (
          <div key={res.id} className="glass-panel resource-card">
            <span className={`badge type-badge badge-${res.type.toLowerCase()}`}>
              {res.type}
            </span>
            <div className="image-container">
              {res.imageUrl ? (
                <img src={res.imageUrl} alt={res.name} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
              ) : (
                <div className="placeholder-img">{res.name.charAt(0)}</div>
              )}
            </div>
            
            <h3 className="card-title">{res.name}</h3>
            
            <div className="card-details">
              <div className="detail-row">
                <MapPin size={16} style={{ color: 'var(--text-secondary)' }}/>
                <span>{res.location}</span>
              </div>
              <div className="detail-row">
                <Users size={16} style={{ color: 'var(--accent-color)' }}/>
                <span>Capacity: <strong>{res.capacity}</strong></span>
              </div>
              <div className="detail-row" style={{ marginTop: '0.5rem' }}>
                <span className={`badge badge-${res.status.toLowerCase()}`}>
                  {res.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.5rem' }}
                onClick={() => handleEdit(res)}
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 1, padding: '0.5rem' }}
                onClick={() => handleDelete(res.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination View */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary" 
            disabled={page === 0} 
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <ResourceForm 
          resource={editingResource} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </div>
  );
};
