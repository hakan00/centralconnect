import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingState from './LoadingState.jsx';
import { truncateText } from '../utils/formatters.js';

export default function Hero({ overview, loading }) {
  const { user } = useAuth();
  const metrics = overview?.metrics || {};
  const featuredGuide = overview?.featuredGuides?.[0];
  const featuredTour = overview?.featuredTours?.[0];
  const spotlightPost = overview?.latestPosts?.[0];

  return (
    <section className="hero reveal">
      <div className="hero-copy">
        <p className="eyebrow">Arrival, Legal and City Services</p>
        <h1>Everything you need to settle in and get around.</h1>
        <p>
          Book your airport transfer, follow legal requests, track university applications, and browse city tours from one account.
        </p>
        <div className="hero-actions">
          <Link to={user ? '/dashboard' : '/register'} className="primary-btn">
            {user ? 'Open Dashboard' : 'Create Account'}
          </Link>
          <Link to="/tours" className="secondary-btn">Explore Tours</Link>
        </div>
        <div className="hero-inline-stats">
          <div>
            <strong>{metrics.legalGuides || 0}</strong>
            <span>Legal guides</span>
          </div>
          <div>
            <strong>{metrics.tours || 0}</strong>
            <span>Tours</span>
          </div>
          <div>
            <strong>{metrics.communityPosts || 0}</strong>
            <span>Community posts</span>
          </div>
        </div>
      </div>

      <div className="hero-card-stack">
        {loading ? (
          <div className="panel hero-panel">
            <LoadingState label="Loading home page..." />
          </div>
        ) : (
          <>
            <article className="feature-card hero-panel">
              <span className="section-kicker">Legal Help</span>
              <h3>{featuredGuide?.title || 'Guides for common legal tasks'}</h3>
              <p>{truncateText(featuredGuide?.summary || 'Useful information for registration, residence, and document checks.', 120)}</p>
            </article>
            <article className="feature-card hero-panel">
              <span className="section-kicker">City Guide</span>
              <h3>{featuredTour?.title || 'Tours will appear here'}</h3>
              <p>{truncateText(featuredTour?.description || 'Browse orientation walks, transport help, and local recommendations.', 120)}</p>
            </article>
            <article className="feature-card hero-panel hero-panel-wide">
              <span className="section-kicker">Community</span>
              <h3>{spotlightPost?.title || 'No recent discussion yet'}</h3>
              <p>{truncateText(spotlightPost?.content || 'Questions, tips, and updates from the community will appear here.', 160)}</p>
            </article>
          </>
        )}
      </div>
    </section>
  );
}
