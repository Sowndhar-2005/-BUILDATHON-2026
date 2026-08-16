import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, BookOpen, Phone, LogIn, UserPlus, 
  LogOut, ShieldAlert, Sparkles, LayoutDashboard, UserCheck, Menu, X
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">EduVision</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">AI Portal</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Integrated Academic Intelligence</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/courses" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/courses') ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Courses Catalog
          </Link>
          <Link 
            to="/contact" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/contact' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            Contact & Support
          </Link>
        </nav>

        {/* Right Section: Auth & User Profile */}
        <div className="flex items-center gap-3">

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                to={`/${role}/dashboard`}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-brand-400" />
                <span className="capitalize">{role} Portal</span>
              </Link>
              
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
                <img 
                  src={user.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} 
                  alt={user.full_name} 
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{role}</p>
                </div>
              </div>

              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-850 rounded-lg transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-secondary !py-2 !px-3.5 text-xs">
                <LogIn className="w-3.5 h-3.5" /> Log In
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-3.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900"
            >
              Courses Catalog
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900"
            >
              Contact & Support
            </Link>
          </nav>

          {!user && (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full justify-center !py-2 text-xs"
              >
                <LogIn className="w-3.5 h-3.5" /> Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full justify-center !py-2 text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

