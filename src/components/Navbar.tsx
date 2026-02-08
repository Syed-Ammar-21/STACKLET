import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

const getInitials = (name: string | undefined, email: string | undefined) => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      // Use first two letters of the name
      return parts[0].substring(0, 2).toUpperCase();
    }
    // Use first letter of first and last word
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (email) {
    // Use first two letters of email (before @)
    const local = email.split('@')[0];
    return local.substring(0, 2).toUpperCase();
  }
  return '?';
};

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user?.user_metadata?.full_name, user?.email);

  const handleSignOut = async () => {
    setMenuOpen(false);
    setShowLogoutOverlay(true);
    
    // Show logout animation for 2.5 seconds
    setTimeout(async () => {
      await signOut();
      navigate('/login');
    }, 2500);
  };

  // Handle click on logo + STACKLET
  const handleLogoClick = () => {
    if (location.pathname === '/' || location.pathname === '/home') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {/* Logout Loading Overlay */}
      {showLogoutOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <img
            src="/translogo.png"
            alt="Stacklet Logo"
            className="w-20 h-20 object-contain animate-bounce mb-4"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <h2 className="text-3xl font-black tracking-wider select-none text-white font-['Orbitron',monospace] uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
            See you soon
          </h2>
          <p className="text-white text-lg font-['Orbitron',monospace]">Logging you out...</p>
        </div>
      )}

      <header className="w-full sticky top-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-md">
        <div className="w-full flex items-center justify-between px-4 py-2">
          {/* Left: Logo and App Name */}
          <button
            className="flex items-center gap-2 min-w-0 focus:outline-none"
            onClick={handleLogoClick}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            aria-label="Go to Home"
          >
            <img
              src="/translogo.png"
              alt="Stacklet Logo"
              className="h-16 w-16 md:h-20 md:w-20 object-contain align-middle -mt-2"
              style={{ marginLeft: 0, filter: 'brightness(0) invert(1)' }}
            />
            <span
              className="text-3xl font-black tracking-wider select-none text-white font-['Orbitron',monospace]"
              style={{ lineHeight: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', letterSpacing: '0.1em' }}
            >
              STACKLET
            </span>
          </button>
          {/* Right: User Avatar and Dropdown */}
          <div
            className="relative flex items-center"
            ref={avatarDropdownRef}
          >
            <div
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
              style={{ position: 'relative' }}
            >
              <button
                className={`ml-4 w-11 h-11 rounded-full bg-black flex items-center justify-center text-white text-lg font-black tracking-wider select-none font-['Orbitron',monospace] shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-white ${menuOpen ? 'scale-110 shadow-2xl' : ''}`}
                title={user?.user_metadata?.full_name || user?.email || 'User'}
                aria-label="User menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                type="button"
                tabIndex={0}
              >
                {initials}
              </button>
              {/* Invisible hover bridge */}
              {menuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: '100%', height: '16px', zIndex: 49 }} />
              )}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-5 w-80 bg-gradient-to-br from-blue-500/90 via-purple-600/90 to-purple-900/90 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-2xl border border-white/20 z-50 opacity-100 scale-100 transition-all duration-200 overflow-hidden font-['Orbitron',monospace]" style={{ minWidth: '320px' }}>
                  <div className="flex items-center gap-4 px-6 pt-6 pb-4">
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold border-2 border-white font-['Orbitron',monospace]">
                      {initials}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="font-bold text-white text-lg truncate font-['Orbitron',monospace]">
                        {user?.user_metadata?.full_name || 'User'}
                      </span>
                      <span className="text-blue-200 text-sm truncate font-['Orbitron',monospace]">{user?.email}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/20 my-1" />
                  <button
                    className="flex items-center gap-2 px-6 py-4 text-red-700 hover:bg-red-900/30 font-semibold text-base rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl transition-colors w-full text-left focus:outline-none focus:bg-red-900/30 font-['Orbitron',monospace]"
                    onClick={handleSignOut}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSignOut();
                      }
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
