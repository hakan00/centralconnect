import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDateTime, formatLabel } from '../utils/formatters.js';

const emptyGuideForm = {
  title: '',
  category: 'registration',
  summary: '',
  details: '',
  estimatedTime: ''
};

const emptyRequestForm = {
  requestType: 'police-record',
  description: ''
};

const guideCategories = ['registration', 'residence', 'documents', 'support'];
const requestTypes = ['police-record', 'residence-guidance', 'document-check'];
const requestStatuses = ['submitted', 'in-review', 'resolved'];

export default function LegalPage() {
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [guideForm, setGuideForm] = useState(emptyGuideForm);
  const [requestForm, setRequestForm] = useState(emptyRequestForm);
  const [editingGuideId, setEditingGuideId] = useState('');
  const [editingRequestId, setEditingRequestId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    try {
      const [guidesRes, requestRes] = await Promise.all([
        api.get('/legal-guides'),
        api.get('/legal-guides/requests')
      ]);
      setGuides(guidesRes.data);
      setRequests(requestRes.data);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Legal data could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetGuideForm = () => {
    setGuideForm(emptyGuideForm);
    setEditingGuideId('');
  };

  const resetRequestForm = () => {
    setRequestForm(emptyRequestForm);
    setEditingRequestId('');
  };

  const onGuideSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingGuideId) {
        await api.put(`/legal-guides/${editingGuideId}`, guideForm);
      } else {
        await api.post('/legal-guides', guideForm);
      }

      resetGuideForm();
      await fetchData();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Guide could not be saved.'));
    }
  };

  const onRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingRequestId) {
        await api.put(`/legal-guides/requests/${editingRequestId}`, requestForm);
      } else {
        await api.post('/legal-guides/requests', requestForm);
      }

      resetRequestForm();
      await fetchData();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Legal request could not be saved.'));
    }
  };

  const onEditGuide = (guide) => {
    setEditingGuideId(guide._id);
    setGuideForm({
      title: guide.title,
      category: guide.category,
      summary: guide.summary,
      details: guide.details || '',
      estimatedTime: guide.estimatedTime || ''
    });
  };

  const onDeleteGuide = async (id) => {
    if (!window.confirm('Delete this legal guide?')) {
      return;
    }

    try {
      await api.delete(`/legal-guides/${id}`);
      if (editingGuideId === id) {
        resetGuideForm();
      }
      await fetchData();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Guide could not be deleted.'));
    }
  };

  const onEditRequest = (request) => {
    setEditingRequestId(request._id);
    setRequestForm({
      requestType: request.requestType,
      description: request.description
    });
  };

  const onDeleteRequest = async (id) => {
    if (!window.confirm('Delete this legal request?')) {
      return;
    }

    try {
      await api.delete(`/legal-guides/requests/${id}`);
      if (editingRequestId === id) {
        resetRequestForm();
      }
      await fetchData();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Legal request could not be deleted.'));
    }
  };

  const onRequestStatusChange = async (id, status) => {
    try {
      await api.put(`/legal-guides/requests/${id}`, { status });
      await fetchData();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Request status could not be updated.'));
    }
  };

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Legal Support"
        title="Guides and requests"
        description="Read practical guides and keep track of your legal support requests."
      />

      {error ? <p className="error-text">{error}</p> : null}

      <div className="legal-grid">
        <div className="stack">
          <article className="panel reveal">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Guides</span>
                <h3>Legal guides</h3>
              </div>
            </div>

            {loading ? (
              <LoadingState label="Loading guides..." />
            ) : guides.length ? (
              <div className="list">
                {guides.map((guide) => (
                  <article key={guide._id} className="resource-card">
                    <div className="resource-topline">
                      <div>
                        <strong>{guide.title}</strong>
                        <p>{guide.summary}</p>
                      </div>
                      <span className="tag-chip">{formatLabel(guide.category)}</span>
                    </div>
                    {guide.details ? <p className="resource-body">{guide.details}</p> : null}
                    <div className="resource-meta">
                      {guide.estimatedTime ? <span>Estimated time: {guide.estimatedTime}</span> : null}
                      <span>Updated {formatDateTime(guide.updatedAt)}</span>
                    </div>
                    {isAdmin ? (
                      <div className="resource-actions">
                        <button type="button" className="ghost-btn" onClick={() => onEditGuide(guide)}>
                          Edit
                        </button>
                        <button type="button" className="ghost-btn danger-btn" onClick={() => onDeleteGuide(guide._id)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No guides available"
                description="Guides will appear here when they are added."
              />
            )}
          </article>

          {isAdmin ? (
            <form onSubmit={onGuideSubmit} className="panel form-grid reveal">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Guide Management</span>
                  <h3>{editingGuideId ? 'Update guide' : 'Create guide'}</h3>
                </div>
              </div>

              <label className="field">
                <span>Guide title</span>
                <input
                  placeholder="Residence Guidance"
                  value={guideForm.title}
                  onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Category</span>
                <select value={guideForm.category} onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}>
                  {guideCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Summary</span>
                <textarea
                  placeholder="Short overview of the guide"
                  value={guideForm.summary}
                  onChange={(e) => setGuideForm({ ...guideForm, summary: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Details</span>
                <textarea
                  placeholder="Specific preparation steps and practical notes"
                  value={guideForm.details}
                  onChange={(e) => setGuideForm({ ...guideForm, details: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Estimated time</span>
                <input
                  placeholder="1 to 2 business days"
                  value={guideForm.estimatedTime}
                  onChange={(e) => setGuideForm({ ...guideForm, estimatedTime: e.target.value })}
                />
              </label>

              <div className="button-row">
                <button className="primary-btn">{editingGuideId ? 'Update Guide' : 'Create Guide'}</button>
                <button type="button" className="ghost-btn" onClick={resetGuideForm}>
                  Reset
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div className="stack">
          <form onSubmit={onRequestSubmit} className="panel form-grid reveal sticky-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Request Form</span>
                <h3>{editingRequestId ? 'Update legal request' : 'Create legal request'}</h3>
              </div>
            </div>

            <label className="field">
              <span>Request type</span>
              <select
                value={requestForm.requestType}
                onChange={(e) => setRequestForm({ ...requestForm, requestType: e.target.value })}
              >
                {requestTypes.map((requestType) => (
                  <option key={requestType} value={requestType}>
                    {requestType}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                placeholder="Describe the legal support you need"
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
              />
            </label>

            <div className="button-row">
              <button className="primary-btn">{editingRequestId ? 'Update Request' : 'Submit Request'}</button>
              <button type="button" className="ghost-btn" onClick={resetRequestForm}>
                Reset
              </button>
            </div>
          </form>

          <article className="panel reveal">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Requests</span>
                <h3>{isAdmin ? 'All legal requests' : 'My legal requests'}</h3>
              </div>
            </div>

            {loading ? (
              <LoadingState label="Loading legal requests..." />
            ) : requests.length ? (
              <div className="list">
                {requests.map((item) => (
                  <article key={item._id} className="resource-card">
                    <div className="resource-topline">
                      <div>
                        <strong>{formatLabel(item.requestType)}</strong>
                        <p>{item.description}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="resource-meta">
                      <span>Updated {formatDateTime(item.updatedAt)}</span>
                      {isAdmin && item.user ? <span>{item.user.fullName} | {item.user.email}</span> : null}
                    </div>

                    <div className="resource-actions">
                      <button type="button" className="ghost-btn" onClick={() => onEditRequest(item)}>
                        Edit
                      </button>
                      {isAdmin ? (
                        <label className="compact-field">
                          <span>Status</span>
                          <select value={item.status} onChange={(e) => onRequestStatusChange(item._id, e.target.value)}>
                            {requestStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                      <button type="button" className="ghost-btn danger-btn" onClick={() => onDeleteRequest(item._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No legal requests yet"
                description="Your legal requests will appear here after you submit one."
              />
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
