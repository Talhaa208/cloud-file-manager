import Link from 'next/link';
import '../styles/globals.css';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link href="/" className="navbar-link">Home</Link>
          <Link href="/login" className="navbar-link">Login</Link>
          <Link href="/register" className="navbar-link">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

