import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Microscope, Map, Clock, BookOpen, Bell, Settings,
  ChevronRight, LogOut, User
} from 'lucide-react';
import { Logo } from '../shared/Logo';
import { getSettings, getNotifications } from '../../lib/storage';
import { cn } from '../../lib/utils';

// ─── Nav Items ────────────────────────────────────────────────────────────────

const DESKTOP_NAV = [
  { to: '/home', label: 'Overview', icon: Home },
  { to: '/analyze', label: 'Analyze', icon: Microscope },
  { to: '/fields', label: 'My Fields', icon: Map },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/library', label: 'Crop Library', icon: BookOpen },
];

const DESKTOP_BOTTOM_NAV = [
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const MOBILE_NAV = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/analyze', label: 'Analyze', icon: Microscope },
  { to: '/fields', label: 'Fields', icon: Map },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/library', label: 'Library', icon: BookOpen },
];

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const settings = getSettings();
  const notifications = getNotifications();
  const unread = notifications.filter(n => !n.read).length;
  const [showProfile, setShowProfile] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[248px] bg-white/70 backdrop-blur-xl border-r border-[#DDE3DB] z-30 shadow-[4px_0_24px_rgba(23,74,53,0.02)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/40">
        <Link to="/home">
          <Logo size={32} showText />
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#2F7D4A]" />
          <span className="text-xs text-[#66736A]">Demo mode · {settings.region.split(',')[0]}</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
        {DESKTOP_NAV.map(item => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-[#DDE3DB] space-y-0.5">
        {DESKTOP_BOTTOM_NAV.map(item => (
          <SidebarNavItem key={item.to} {...item} badge={item.to === '/notifications' ? unread : undefined} />
        ))}
      </div>

      {/* Profile */}
      <div className="px-3 pb-4 pt-2 border-t border-[#DDE3DB]">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-[#EEF1E9] transition-colors"
          onClick={() => setShowProfile(!showProfile)}
          aria-expanded={showProfile}
          aria-haspopup="menu"
        >
          <div className="h-8 w-8 rounded-full bg-[#174A35] flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-white">{settings.name[0]}</span>
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-sm font-medium text-[#1E2923] truncate">{settings.name}</p>
            <p className="text-xs text-[#66736A] truncate">Demo account</p>
          </div>
          <ChevronRight className={cn('h-4 w-4 text-[#66736A] transition-transform', showProfile && 'rotate-90')} />
        </button>
        {showProfile && (
          <div className="mt-1 bg-white border border-[#DDE3DB] rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
            <Link to="/settings" className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#1E2923] hover:bg-[#EEF1E9] transition-colors">
              <User className="h-4 w-4 text-[#66736A]" />
              Settings
            </Link>
            <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#66736A] hover:bg-[#EEF1E9] transition-colors">
              <LogOut className="h-4 w-4" />
              Demo mode — data is local
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarNavItem: React.FC<{
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}> = ({ to, label, icon: Icon, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors group',
        isActive
          ? 'bg-[#DDEBDF] text-[#174A35]'
          : 'text-[#66736A] hover:bg-[#EEF1E9] hover:text-[#1E2923]'
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-[#174A35]' : 'text-[#66736A] group-hover:text-[#1E2923]')} />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 && (
          <span className="text-xs bg-[#B54747] text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

// ─── Mobile Header ────────────────────────────────────────────────────────────

export const MobileHeader: React.FC<{ title?: string }> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = getNotifications();
  const unread = notifications.filter(n => !n.read).length;
  const settings = getSettings();
  const isHome = location.pathname === '/home';

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-xl border-b border-[#DDE3DB] safe-top shadow-[0_4px_24px_rgba(23,74,53,0.02)]">
      <div className="flex items-center h-14 px-4 gap-3">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 flex items-center justify-center rounded-[10px] hover:bg-[#EEF1E9] -ml-1 shrink-0"
            aria-label="Go back"
          >
            <svg className="h-5 w-5 text-[#1E2923]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {isHome ? (
          <Link to="/home" className="flex-1">
            <Logo size={28} showText />
          </Link>
        ) : (
          <h1 className="flex-1 text-base font-semibold text-[#1E2923] truncate">{title}</h1>
        )}
        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="relative h-9 w-9 flex items-center justify-center rounded-[10px] hover:bg-[#EEF1E9]"
            aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
          >
            <Bell className="h-5 w-5 text-[#66736A]" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-[#B54747] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
          <Link
            to="/settings"
            className="h-9 w-9 flex items-center justify-center rounded-full bg-[#174A35]"
            aria-label="Profile and settings"
          >
            <span className="text-sm font-semibold text-white">{settings.name[0]}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

// ─── Mobile Bottom Navigation ─────────────────────────────────────────────────

export const MobileNav: React.FC = () => (
  <nav
    className="mobile-nav lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-xl border-t border-[#DDE3DB] shadow-[0_-4px_24px_rgba(23,74,53,0.02)]"
    aria-label="Bottom navigation"
  >
    <div className="flex items-stretch">
      {MOBILE_NAV.map(item => (
        <MobileNavItem key={item.to} {...item} isAnalyze={item.to === '/analyze'} />
      ))}
    </div>
  </nav>
);

const MobileNavItem: React.FC<{
  to: string;
  label: string;
  icon: React.ElementType;
  isAnalyze?: boolean;
}> = ({ to, label, icon: Icon, isAnalyze }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-xs font-medium transition-colors',
        isActive
          ? 'text-[#174A35]'
          : 'text-[#66736A]',
        isAnalyze && 'relative'
      )
    }
    aria-label={label}
  >
    {({ isActive }) => (
      <>
        {isAnalyze ? (
          <div className={cn(
            'h-11 w-11 rounded-[14px] flex items-center justify-center transition-all mb-0.5',
            isActive ? 'bg-[#174A35]' : 'bg-[#174A35]/90'
          )}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className={cn(
            'h-8 w-8 rounded-[10px] flex items-center justify-center transition-colors',
            isActive ? 'bg-[#DDEBDF]' : 'bg-transparent'
          )}>
            <Icon className={cn('h-5 w-5', isActive ? 'text-[#174A35]' : 'text-[#66736A]')} />
          </div>
        )}
        <span className={cn(isActive ? 'text-[#174A35]' : 'text-[#66736A]', isAnalyze && 'font-semibold')}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

// ─── Page Shell ───────────────────────────────────────────────────────────────

interface ShellProps {
  title?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  noPad?: boolean;
}

export const Shell: React.FC<ShellProps> = ({ title, children, fullWidth, noPad }) => (
  <div className="min-h-dvh">
    <Sidebar />
    <MobileHeader title={title} />
    <main className={cn(
      'lg:ml-[248px] min-h-dvh',
      !noPad && 'pt-14 lg:pt-0',
      'pb-20 lg:pb-0',
    )}>
      <div className={cn(
        !fullWidth && 'max-w-5xl mx-auto',
        !noPad && 'px-4 py-5 lg:px-8 lg:py-7'
      )}>
        {children}
      </div>
    </main>
    <MobileNav />
  </div>
);

// ─── Desktop Page Header ──────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  const settings = getSettings();
  const notifications = getNotifications();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E2923] leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#66736A] mt-0.5">{subtitle}</p>}
      </div>
      <div className="hidden lg:flex items-center gap-3">
        {actions}
        <Link
          to="/notifications"
          className="relative h-9 w-9 flex items-center justify-center rounded-[10px] border border-[#DDE3DB] bg-white hover:bg-[#EEF1E9] transition-colors"
          aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        >
          <Bell className="h-4.5 w-4.5 text-[#66736A]" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#B54747] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 h-9 px-3 rounded-[10px] border border-[#DDE3DB] bg-white hover:bg-[#EEF1E9] transition-colors"
          aria-label="Profile and settings"
        >
          <div className="h-5.5 w-5.5 rounded-full bg-[#174A35] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{settings.name[0]}</span>
          </div>
          <span className="text-sm text-[#1E2923] font-medium">{settings.name}</span>
        </Link>
      </div>
    </div>
  );
};
