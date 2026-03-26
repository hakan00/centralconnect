import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDateTime, toInputDateTime } from '../utils/formatters.js';

const emptyForm = {
  airport: '',
  destination: '',
  arrivalDate: '',
  passengers: 1,
  notes: ''
};

const transferStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function TransfersPage() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchTransfers = async () => {
    try {
      const { data } = await api.get('/transfers');
      setTransfers(data);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Transfers could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
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
        await api.put(`/transfers/${editingId}`, form);
      } else {
        await api.post('/transfers', form);
      }

      resetForm();
      await fetchTransfers();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Transfer could not be saved.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      airport: item.airport,
      destination: item.destination,
      arrivalDate: toInputDateTime(item.arrivalDate),
      passengers: item.passengers,
      notes: item.notes || ''
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this transfer request?')) {
      return;
    }

    try {
      await api.delete(`/transfers/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await fetchTransfers();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Transfer could not be deleted.'));
    }
  };

  const onStatusChange = async (id, status) => {
    try {
      await api.patch(`/transfers/${id}/status`, { status });
      await fetchTransfers();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Transfer status could not be updated.'));
    }
  };

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Arrival Services"
        title="Airport transfer management"
        description="Book, update, and track your airport transfer requests."
        actions={
          editingId ? (
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Cancel editing
            </button>
          ) : null
        }
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="workspace-grid">
        <form onSubmit={onSubmit} className="panel form-grid sticky-panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Request Form</span>
              <h3>{editingId ? 'Update transfer request' : 'Create transfer request'}</h3>
            </div>
          </div>

          <label className="field">
            <span>Airport</span>
            <input
              placeholder="Vaclav Havel Airport"
              value={form.airport}
              onChange={(e) => setForm({ ...form, airport: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Destination</span>
            <input
              placeholder="Student dormitory or hotel"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Arrival date and time</span>
            <input
              type="datetime-local"
              value={form.arrivalDate}
              onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Passengers</span>
            <input
              type="number"
              min="1"
              value={form.passengers}
              onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              placeholder="Flight number, arrival hall, luggage details, or special instructions"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          <div className="button-row">
            <button className="primary-btn" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Transfer' : 'Create Transfer'}
            </button>
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        <div className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Requests</span>
              <h3>{isAdmin ? 'All transfer requests' : 'My transfer requests'}</h3>
            </div>
          </div>

          {loading ? (
            <LoadingState label="Loading transfers..." />
          ) : transfers.length ? (
            <div className="list">
              {transfers.map((item) => (
                <article key={item._id} className="resource-card">
                  <div className="resource-topline">
                    <div>
                      <strong>{item.airport} to {item.destination}</strong>
                      <p>{formatDateTime(item.arrivalDate)}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="resource-meta">
                    <span>{item.passengers} passenger(s)</span>
                    {isAdmin && item.user ? <span>{item.user.fullName} | {item.user.email}</span> : null}
                  </div>

                  {item.notes ? <p className="resource-body">{item.notes}</p> : null}

                  <div className="resource-actions">
                    <button type="button" className="ghost-btn" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                    {isAdmin ? (
                      <label className="compact-field">
                        <span>Status</span>
                        <select value={item.status} onChange={(e) => onStatusChange(item._id, e.target.value)}>
                          {transferStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                    <button type="button" className="ghost-btn danger-btn" onClick={() => onDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No transfer requests yet"
              description="Your transfer requests will appear here after you create one."
            />
          )}
        </div>
      </div>
    </section>
  );
}
