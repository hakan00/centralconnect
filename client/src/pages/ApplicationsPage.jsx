import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDate, formatDateTime } from '../utils/formatters.js';

const emptyForm = {
  universityName: '',
  programName: '',
  intakeTerm: '',
  status: 'draft',
  notes: ''
};

const applicationStatuses = ['draft', 'submitted', 'under-review', 'accepted', 'rejected'];

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Applications could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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
        await api.put(`/applications/${editingId}`, form);
      } else {
        await api.post('/applications', form);
      }

      resetForm();
      await fetchApplications();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Application could not be saved.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      universityName: item.universityName,
      programName: item.programName,
      intakeTerm: item.intakeTerm,
      status: item.status,
      notes: item.notes || ''
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this application record?')) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await fetchApplications();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Application could not be deleted.'));
    }
  };

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Applications"
        title="University applications"
        description="Keep your university applications, status updates, and notes together."
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
              <span className="section-kicker">Application Form</span>
              <h3>{editingId ? 'Update application record' : 'Add application record'}</h3>
            </div>
          </div>

          <label className="field">
            <span>University</span>
            <input
              placeholder="University name"
              value={form.universityName}
              onChange={(e) => setForm({ ...form, universityName: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Program</span>
            <input
              placeholder="Program name"
              value={form.programName}
              onChange={(e) => setForm({ ...form, programName: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Intake term</span>
            <input
              placeholder="Fall 2026"
              value={form.intakeTerm}
              onChange={(e) => setForm({ ...form, intakeTerm: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              placeholder="Deadlines, missing documents, interview notes, or scholarship context"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          <div className="button-row">
            <button className="primary-btn" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Application' : 'Add Application'}
            </button>
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        <div className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Application Records</span>
              <h3>{isAdmin ? 'All application records' : 'My applications'}</h3>
            </div>
          </div>

          {loading ? (
            <LoadingState label="Loading applications..." />
          ) : applications.length ? (
            <div className="list">
              {applications.map((item) => (
                <article key={item._id} className="resource-card">
                  <div className="resource-topline">
                    <div>
                      <strong>{item.universityName}</strong>
                      <p>{item.programName}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="resource-meta">
                    <span>{item.intakeTerm}</span>
                    <span>Updated {formatDateTime(item.updatedAt)}</span>
                    {isAdmin && item.user ? <span>{item.user.fullName}</span> : null}
                  </div>

                  {item.notes ? <p className="resource-body">{item.notes}</p> : null}

                  <div className="resource-actions">
                    <button type="button" className="ghost-btn" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="ghost-btn danger-btn" onClick={() => onDelete(item._id)}>
                      Delete
                    </button>
                  </div>

                  <small className="resource-footnote">Created {formatDate(item.createdAt)}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No application records yet"
              description="Your applications will appear here after you add one."
            />
          )}
        </div>
      </div>
    </section>
  );
}
