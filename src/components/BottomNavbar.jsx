import { Link, useLocation } from 'react-router-dom';
import { House, WalletMinimal, Sparkles, Settings } from 'lucide-react';

function BottomNavbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="bottom-nav navbar fixed-bottom m-2 px-3 py-2 rounded-4 shadow-sm "
      role="navigation"
      aria-label="Navegación inferior"
    >
      <Link
        to="/"
        className={`bottom-tab ${isActive('/') ? 'is-active' : ''}`}
        aria-current={isActive('/') ? 'page' : undefined}
      >
        <span className="icon-wrap">
          <House size={22} />
        </span>
        <small className="label">Home</small>
      </Link>

      <Link
        to="/transactions"
        className={`bottom-tab ${isActive('/transactions') ? 'is-active' : ''}`}
        aria-current={isActive('/transactions') ? 'page' : undefined}
      >
        <span className="icon-wrap">
          <WalletMinimal size={22} />
        </span>
        <small className="label">Transactions</small>
      </Link>

      <Link
        to="/insights"
        className={`bottom-tab ${isActive('/insights') ? 'is-active' : ''}`}
        aria-current={isActive('/insights') ? 'page' : undefined}
      >
        <span className="icon-wrap">
          <Sparkles size={22} />
        </span>
        <small className="label">Progress</small>
      </Link>

      <Link
        to="/settings"
        className={`bottom-tab ${isActive('/settings') ? 'is-active' : ''}`}
        aria-current={isActive('/settings') ? 'page' : undefined}
      >
        <span className="icon-wrap">
          <Settings size={22} />
        </span>
        <small className="label">Settings</small>
      </Link>
    </nav>
  );
}

export default BottomNavbar;
