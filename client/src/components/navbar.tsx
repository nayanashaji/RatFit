import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Sign Up" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/qr", label: "QR Check-in" },
    { path: "/gyms", label: "Gym Dashboard" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <div className="logo-icon">RF</div>
          <div className="logo-text">RatFit</div>
        </div>
        
        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`navbar-link ${location === item.path ? 'active' : ''}`}
              data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}