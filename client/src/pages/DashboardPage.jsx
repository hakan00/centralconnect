import { useEffect, useState } from 'react';
import api from '../api/api.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import MetricCard from '../components/MetricCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { getApiMessage } from '../utils/http.js';
import { formatDateTime, truncateText } from '../utils/formatters.js';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/summary');
        setSummary(data);
      } catch (requestError) {
        setError(getApiMessage(requestError, 'Dashboard could not be loaded.'));
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const profile = summary?.profile;
  const metrics = summary?.metrics;
  const highlights = summary?.highlights;

  return (
    <section className="page-shell">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back${profile?.fullName ? `, ${profile.fullName}` : ''}`}
        description="See your transfer requests, legal updates, applications, and recent community activity."
        aside={
          <div className="profile-card">
            <span className="section-kicker">{profile?.role === 'admin' ? 'Administrator' : 'Account'}</span>
            <strong>{profile?.email || 'No email available'}</strong>
            <p>{profile?.nationality || 'Nationality not specified'}</p>
          </div>
        }
      />

      {loading ? <LoadingState label="Loading dashboard..." /> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && summary ? (
        <>
          <div className="metrics-grid">
            <MetricCard
              label="Transfer requests"
              value={metrics.transfers}
              hint={`${metrics.activeTransfers} upcoming or pending`}
              accent="blue"
            />
            <MetricCard
              label="Application tracker"
              value={metrics.applications}
              hint={`${metrics.activeApplications} currently in progress`}
              accent="gold"
            />
            <MetricCard
              label="Legal requests"
              value={metrics.legalRequests}
              hint={`${metrics.openLegalRequests} waiting for review`}
              accent="green"
            />
            <MetricCard
              label="Community footprint"
              value={metrics.communityPosts}
              hint={`${metrics.legalGuides} guides available`}
              accent="plum"
            />
          </div>

          <div className="dashboard-grid">
            <article className="panel dashboard-panel-wide reveal">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Recent Activity</span>
                  <h3>Latest updates</h3>
                </div>
              </div>
              <div className="summary-strip">
                <article className="summary-tile">
                  <span className="section-kicker">Next transfer</span>
                  {highlights.nextTransfer ? (
                    <>
                      <strong>{highlights.nextTransfer.airport} to {highlights.nextTransfer.destination}</strong>
                      <p>{formatDateTime(highlights.nextTransfer.arrivalDate)}</p>
                      <StatusBadge status={highlights.nextTransfer.status} />
                    </>
                  ) : (
                    <EmptyState
                      title="No transfer scheduled"
                      description="Your next transfer will appear here."
                    />
                  )}
                </article>

                <article className="summary-tile">
                  <span className="section-kicker">Latest application</span>
                  {highlights.latestApplication ? (
                    <>
                      <strong>{highlights.latestApplication.universityName}</strong>
                      <p>{highlights.latestApplication.programName}</p>
                      <StatusBadge status={highlights.latestApplication.status} />
                    </>
                  ) : (
                    <EmptyState
                      title="No application record"
                      description="Your latest application will appear here."
                    />
                  )}
                </article>

                <article className="summary-tile">
                  <span className="section-kicker">Latest legal request</span>
                  {highlights.latestLegalRequest ? (
                    <>
                      <strong>{highlights.latestLegalRequest.requestType}</strong>
                      <p>{truncateText(highlights.latestLegalRequest.description, 110)}</p>
                      <StatusBadge status={highlights.latestLegalRequest.status} />
                    </>
                  ) : (
                    <EmptyState
                      title="No legal request yet"
                      description="Your latest legal request will appear here."
                    />
                  )}
                </article>
              </div>
            </article>

            <article className="panel reveal">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Community</span>
                  <h3>Recent discussions</h3>
                </div>
              </div>
              {highlights.latestPosts?.length ? (
                <div className="list">
                  {highlights.latestPosts.map((post) => (
                    <article className="list-card" key={post._id}>
                      <strong>{post.title}</strong>
                      <p>{truncateText(post.content, 120)}</p>
                      <small>{post.user?.fullName || 'Community member'}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No recent posts"
                  description="New posts will show up here when people share updates."
                />
              )}
            </article>

            <article className="panel reveal">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">City Guides</span>
                  <h3>Featured tours</h3>
                </div>
              </div>
              {highlights.featuredTours?.length ? (
                <div className="list">
                  {highlights.featuredTours.map((tour) => (
                    <article className="list-card" key={tour._id}>
                      <strong>{tour.title}</strong>
                      <p>{truncateText(tour.description, 100)}</p>
                      <small>{tour.city} | {tour.duration}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tours available"
                  description="Tours will appear here when they are added."
                />
              )}
            </article>
          </div>
        </>
      ) : null}
    </section>
  );
}
