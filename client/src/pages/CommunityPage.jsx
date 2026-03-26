import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDateTime, formatLabel, truncateText } from '../utils/formatters.js';

const emptyForm = {
  title: '',
  content: '',
  tag: 'social'
};

const tagOptions = ['all', 'social', 'housing', 'education', 'transport', 'legal'];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/community');
      setPosts(data);
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Community feed could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const visiblePosts = activeTag === 'all' ? posts : posts.filter((post) => post.tag === activeTag);

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
        await api.put(`/community/${editingId}`, form);
      } else {
        await api.post('/community', form);
      }

      resetForm();
      await fetchPosts();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Post could not be saved.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title,
      content: post.content,
      tag: post.tag
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this community post?')) {
      return;
    }

    try {
      await api.delete(`/community/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await fetchPosts();
    } catch (requestError) {
      setError(getApiMessage(requestError, 'Post could not be deleted.'));
    }
  };

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Community"
        title="Posts and updates"
        description="Share questions, tips, and useful local information with other users."
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
              <span className="section-kicker">New Post</span>
              <h3>{editingId ? 'Update community post' : 'Publish community post'}</h3>
            </div>
          </div>

          <label className="field">
            <span>Title</span>
            <input
              placeholder="Share a useful insight"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Topic</span>
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
              {tagOptions.filter((tag) => tag !== 'all').map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Content</span>
            <textarea
              placeholder="Write practical advice, local knowledge, or a question for the community"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </label>

          <div className="button-row">
            <button className="primary-btn" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
            </button>
            <button type="button" className="ghost-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        <div className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Recent Posts</span>
              <h3>Recent posts</h3>
            </div>
          </div>

          <div className="filter-row">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-chip${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {formatLabel(tag)}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingState label="Loading community posts..." />
          ) : visiblePosts.length ? (
            <div className="list">
              {visiblePosts.map((post) => {
                const canManagePost = user?.role === 'admin' || post.user?._id === user?._id;

                return (
                  <article className="resource-card" key={post._id}>
                    <div className="resource-topline">
                      <div>
                        <strong>{post.title}</strong>
                        <p>{truncateText(post.content, 180)}</p>
                      </div>
                      <span className="tag-chip">{formatLabel(post.tag)}</span>
                    </div>

                    <div className="resource-meta">
                      <span>{post.user?.fullName || 'Anonymous'}</span>
                      <span>{formatDateTime(post.createdAt)}</span>
                    </div>

                    {canManagePost ? (
                      <div className="resource-actions">
                        <button type="button" className="ghost-btn" onClick={() => onEdit(post)}>
                          Edit
                        </button>
                        <button type="button" className="ghost-btn danger-btn" onClick={() => onDelete(post._id)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No posts for this topic"
              description="Choose another category or check back later."
            />
          )}
        </div>
      </div>
    </section>
  );
}
