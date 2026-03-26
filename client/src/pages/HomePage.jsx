import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import Hero from '../components/Hero.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatLabel, truncateText } from '../utils/formatters.js';

export default function HomePage() {
  const [overview, setOverview] = useState({
    metrics: { tours: 0, communityPosts: 0, legalGuides: 0 },
    featuredTours: [],
    latestPosts: [],
    featuredGuides: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await api.get('/dashboard/public');
        setOverview(data);
      } catch (requestError) {
        setError(getApiMessage(requestError, 'Overview could not be loaded.'));
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <>
      <Hero overview={overview} loading={loading} />

      <section className="page-section">
        <PageHeader
          eyebrow="What You Can Do"
          title="Manage your arrival, paperwork, and plans in one place"
          description="CentralConnect brings together legal help, local guidance, community posts, and city tours."
          level="h2"
        />
        {error ? <p className="error-text">{error}</p> : null}
        <div className="metrics-grid">
          <MetricCard
            label="Published guides"
            value={overview.metrics.legalGuides}
            hint="Helpful articles for registration, residence, and document checks."
            accent="gold"
          />
          <MetricCard
            label="Curated tours"
            value={overview.metrics.tours}
            hint="Routes and guides for getting around the city."
            accent="blue"
          />
          <MetricCard
            label="Community activity"
            value={overview.metrics.communityPosts}
            hint="Updates, questions, and tips from other users."
            accent="green"
          />
        </div>
      </section>

      <section className="page-section showcase-grid">
        <article className="panel reveal">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Guidance Library</span>
                <h3>Featured legal guides</h3>
              </div>
            <Link className="ghost-btn" to="/legal">View guides</Link>
          </div>
          {loading ? (
            <LoadingState label="Loading legal guides..." />
          ) : overview.featuredGuides.length ? (
            <div className="list">
              {overview.featuredGuides.map((guide) => (
                <article className="list-card" key={guide._id}>
                  <div className="resource-topline">
                    <strong>{guide.title}</strong>
                    <span className="tag-chip">{formatLabel(guide.category)}</span>
                  </div>
                  <p>{guide.summary}</p>
                  {guide.estimatedTime ? <small>Estimated time: {guide.estimatedTime}</small> : null}
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

        <article className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Community Feed</span>
              <h3>Recent conversations</h3>
            </div>
            <Link className="ghost-btn" to="/community">View feed</Link>
          </div>
          {loading ? (
            <LoadingState label="Loading community posts..." />
          ) : overview.latestPosts.length ? (
            <div className="list">
              {overview.latestPosts.map((post) => (
                <article className="list-card" key={post._id}>
                  <div className="resource-topline">
                    <strong>{post.title}</strong>
                    <span className="tag-chip">{formatLabel(post.tag)}</span>
                  </div>
                  <p>{truncateText(post.content, 140)}</p>
                  <small>{post.user?.fullName || 'Community member'}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No posts yet"
              description="New posts will appear here as people share updates and advice."
            />
          )}
        </article>
      </section>

      <section className="page-section">
        <article className="panel reveal">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Digital Guide</span>
              <h3>Highlighted city tours</h3>
            </div>
            <Link className="ghost-btn" to="/tours">Browse all tours</Link>
          </div>
          {loading ? (
            <LoadingState label="Loading tours..." />
          ) : overview.featuredTours.length ? (
            <div className="tour-grid">
              {overview.featuredTours.map((tour) => (
                <article className="tour-card" key={tour._id}>
                  <span className="tag-chip">{formatLabel(tour.category)}</span>
                  <h3>{tour.title}</h3>
                  <p>{tour.description}</p>
                  <div className="resource-meta">
                    <span>{tour.city}</span>
                    <span>{tour.duration}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tours available"
              description="City tours will appear here when they are added."
            />
          )}
        </article>
      </section>
    </>
  );
}
