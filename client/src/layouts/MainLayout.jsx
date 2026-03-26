import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <div className="app-aura aura-one" />
      <div className="app-aura aura-two" />
      <Navbar />
      <main className="container site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container site-footer-inner">
          <p>CentralConnect helps you manage arrivals, legal requests, university applications, and local guidance in one place.</p>
          <span>Stay organized before and after you arrive.</span>
        </div>
      </footer>
    </div>
  );
}
