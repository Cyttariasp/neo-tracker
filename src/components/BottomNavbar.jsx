import { Link, useLocation } from 'react-router-dom';
import { House, WalletMinimal, Sparkles, Settings } from 'lucide-react';
import AddNewExpensive from './AddNewExpense';

function BottomNavbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar fixed-bottom d-flex justify-content-around py-2 px-3 m-2 navbar-glow">
      <Link to="/" className="text-center text-decoration-none">
        <House size={24} className={`nav-icon ${isActive('/') ? 'active' : ''}`} />
        <div className={`small ${isActive('/') ? 'text-black' : 'text-secondary'}`}>Home</div>
      </Link>
      <Link to="/transactions" className="text-center text-decoration-none">
        <WalletMinimal size={24} className={`nav-icon ${isActive('/transactions') ? 'active' : ''}`} />
        <div className={`small ${isActive('/transactions') ? 'text-black' : 'text-secondary'}`}>Transactions</div>
      </Link>
      <Link to="/insights" className="text-center text-decoration-none">
        <Sparkles size={24} className={`nav-icon ${isActive('/insights') ? 'active' : ''}`} />
        <div className={`small ${isActive('/insights') ? 'text-black' : 'text-secondary'}`}>Progress</div>
      </Link>
      <Link to="/settings" className="text-center text-decoration-none">
        <Settings size={24} className={`nav-icon ${isActive('/settings') ? 'active' : ''}`} />
        <div className={`small ${isActive('/settings') ? 'text-black' : 'text-secondary'}`}>Settings</div>
      </Link>
    </nav>
  );
}

export default BottomNavbar;