import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi"; // Feather icons
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="top-navbar">
      <input type="text" placeholder="Search..." className="navbar-search" />

      <div className="navbar-title">Pro Counsellor</div>

      <div className="navbar-actions">
        <button className="icon-btn" title="Login"><FiLogIn /></button>
        <button className="icon-btn" title="Profile"><FiUser /></button>
        <button className="icon-btn" title="Logout"><FiLogOut /></button>
      </div>
    </nav>
  );
};

export default Navbar;
