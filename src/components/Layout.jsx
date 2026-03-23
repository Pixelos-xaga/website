import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Terminal, Download, History, HelpCircle, ArrowUpRight, Github } from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { id: 'home', path: '/', label: 'Home', icon: Home },
  { id: 'instructions', path: '/instructions', label: 'Instructions', icon: Terminal },
  { id: 'downloads', path: '/downloads', label: 'Downloads', icon: Download },
  { id: 'changelogs', path: '/changelogs', label: 'Changelogs', icon: History },
  { id: 'support', path: '/support', label: 'Support', icon: HelpCircle },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl will-change-transform transform-gpu">
        <nav className="glass flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl shadow-black/20">
          <Link to="/" className="flex items-center gap-2 px-2 py-1 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
              <img src="/favicon-source.svg" alt="PixelOS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-brand font-bold text-base leading-none">PixelOS</span>
              <span className="font-plain text-xs text-on-surface-variant leading-none">xaga hub</span>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-2.5 sm:px-3 lg:px-5 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 shrink-0",
                    isActive 
                      ? "text-accent" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                  )}
                >
                  <Icon size={isActive ? 20 : 18} className={isActive ? "fill-accent/20" : ""} />
                  <span className="hidden xl:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 shrink-0">
             <a 
              href="https://github.com/Pixelos-xaga/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/5 transition-colors text-on-surface-variant hover:text-accent"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>
             <a 
              href="https://t.me/XAGASupport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-accent text-on-brand font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent-hover transition-colors"
            >
              Telegram
              <ArrowUpRight size={14} />
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        {children}
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/favicon-source.svg" alt="PixelOS Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-brand font-bold text-base">PixelOS for Xaga</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-sm:max-w-xs">
              Pixelos for xaga (Redmi K50i, POCO X4 GT, Redmi Note 11T/Pro+)
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2 text-sm text-on-surface-variant">
            <div className="flex gap-4">
              <a href="https://pixelos.net" className="hover:text-accent transition-colors">Official Website</a>
              <a href="https://github.com/Pixelos-xaga/" className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
