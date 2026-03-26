import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDateTime, formatLabel } from '../utils/formatters.js';

const emptyForm = {
  title: '',
  city: '',
  duration: '',
  category: 'orientation',
  description: ''
};

const tourCategories = ['orientation', 'culture', 'food', 'transport'];

export default function ToursPage() {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchTours = async () => {
    try {
      const { data } = await api.get('/tours');
      setTours(data);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Tours could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/tours/${editingId}`, form);
      } else {
        await api.post('/tours', form);
      }

      resetForm();
      await fetchTours();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Tour could not be saved.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (tour) => {
    setEditingId(tour._id);
    setForm({
      title: tour.title,
      city: tour.city,
      duration: tour.duration,
      category: tour.category,
      description: tour.description
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this tour?')) {
      return;
    }

    try {
      await api.delete(`/tours/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await fetchTours();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Tour could not be deleted.'));
    }
  };

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="City Guide"
        title="Tours and orientation routes"
        description="Browse city tours and orientation routes, or manage them if you have permission."
        actions={
          isAdmin && editingId ? (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Cancel editing
            </button>
          ) : null
        }
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className={isAdmin ? 'workspace-grid tours-admin-grid' : 'page-section'}>
        {isAdmin ? (
          <form onSubmit={onSubmit} className="panel form-grid sticky-panel reveal">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Tour Management</span>
                <h3>{editingId ? 'Update tour' : 'Create tour'}</h3>
              </div>
            </div>

            <label className="field">
              <span>Title</span>
              <input
                placeholder="Prague Orientation Walk"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="field">
              <span>City</span>
              <input
                placeholder="Prague"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Duration</span>
              <input
                placeholder="2 hours"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {tourCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                placeholder="Describe the route, audience, and practical value"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <div className="button-row">
              <button className="primary-btn" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Tour' : 'Create Tour'}
              </button>
              <button type="button" className="ghost-btn" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        ) : null}

        <div className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Tours</span>
              <h3>Published tours</h3>
            </div>
          </div>

          {loading ? (
            <LoadingState label="Loading tours..." />
          ) : tours.length ? (
            <div className="tour-grid">
              {tours.map((tour) => (
                <article className="tour-card" key={tour._id}>
                  <div className="resource-topline">
                    <span className="tag-chip">{formatLabel(tour.category)}</span>
                    <small>{formatDateTime(tour.updatedAt)}</small>
                  </div>
                  <h3>{tour.title}</h3>
                  <p>{tour.description}</p>
                  <div className="resource-meta">
                    <span>{tour.city}</span>
                    <span>{tour.duration}</span>
                  </div>
                  {isAdmin ? (
                    <div className="resource-actions">
                      <button type="button" className="ghost-btn" onClick={() => onEdit(tour)}>
                        Edit
                      </button>
                      <button type="button" className="ghost-btn danger-btn" onClick={() => onDelete(tour._id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tours available"
              description="Tours will appear here when they are added."
            />
          )}
        </div>
      </div>
    </section>
  );
}
