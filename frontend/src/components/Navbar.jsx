import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Film, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Eigon</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/create" className="text-gray-300 hover:text-white transition-colors">Create Video</Link>
                <Link to="/characters" className="text-gray-300 hover:text-white transition-colors">Characters</Link>
                <div className="h-6 w-px bg-white/10"></div>
                
                <div className="flex items-center space-x-4">
                  <Link to="/billing" className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">Log in</Link>
                <Link to="/signup" className="btn-primary py-2 px-4 shadow-[0_0_15px_rgba(99,102,241,0.3)]">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/create" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Create Video</Link>
                <Link to="/characters" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Characters</Link>
                <Link to="/billing" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Account Info</Link>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-white/5 rounded-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link to="/signup" className="block px-3 py-2 text-base font-medium text-primary-400 hover:bg-white/5 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
