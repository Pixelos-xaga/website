import { motion } from 'framer-motion';
import { History, Calendar, Tag, ChevronRight, ExternalLink, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseChangelogs, sortChangelogsByDate, getChangelogDateFromHash } from '../lib/changelog-utils';
import changelogMarkdown from '../content/changelog.md?raw';
import { cn } from '../lib/utils';

export default function Changelogs() {
  const [changelogs, setChangelogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsed = parseChangelogs(changelogMarkdown);
    const sorted = sortChangelogsByDate(parsed);
    setChangelogs(sorted);
    
    // Check hash on initial load
    const dateFromHash = getChangelogDateFromHash(hash);
    if (dateFromHash) {
      const log = sorted.find(l => l.date === dateFromHash);
      if (log) {
        setSelectedLog(log);
        return;
      }
    }
    
    if (sorted.length > 0) {
      setSelectedLog(sorted[0]);
    }
  }, []);

  // Sync selection with hash changes
  useEffect(() => {
    const dateFromHash = getChangelogDateFromHash(hash);
    if (dateFromHash && changelogs.length > 0) {
      const log = changelogs.find(l => l.date === dateFromHash);
      if (log && log.date !== selectedLog?.date) {
        setSelectedLog(log);
      }
    }
  }, [hash, changelogs, selectedLog]);

  const handleSelect = (log) => {
    setSelectedLog(log);
    navigate(`#${log.date}`);
  };

  if (!selectedLog) return null;

  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-4">
        <h1 className="text-4xl font-brand font-bold">Changelogs</h1>
        <p className="text-on-surface-variant max-w-2xl font-plain">
          Stay up to date with the latest improvements and fixes for xaga.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="space-y-4 lg:sticky lg:top-24 max-h-[calc(100vh-150px)] overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-[10px] font-bold text-accent uppercase tracking-widest ml-4 mb-2">Releases</div>
          {changelogs.map((log, idx) => (
            <button
              key={log.date}
              onClick={() => handleSelect(log)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                selectedLog.date === log.date 
                  ? "glass border-accent/20 bg-accent/5 shadow-lg shadow-black/20" 
                  : "hover:bg-white/5 text-on-surface-variant border border-transparent"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-bold", selectedLog.date === log.date ? "text-accent" : "text-on-surface")}>
                    {log.date}
                  </span>
                  {log.tag && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-on-brand font-bold">
                      {log.tag}
                    </span>
                  )}
                </div>
                <div className="text-[10px] opacity-60 font-mono">{log.version}</div>
              </div>
              <ChevronRight size={16} className={cn("transition-transform", selectedLog.date === log.date ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <motion.main 
          key={selectedLog.date}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigate(`#${selectedLog.date}`);
                    // Optional: show a small toast or feedback
                  }}
                  className="p-2.5 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-on-brand transition-all duration-300 cursor-pointer shadow-lg shadow-black/5 hover:shadow-accent/20 active:scale-95 group/icon"
                  title="Link to this release"
                >
                  <Calendar size={22} className="group-hover/icon:scale-110 transition-transform" />
                </button>
                <h2 className="text-2xl font-bold">{selectedLog.date}</h2>
              </div>
              <p className="text-sm text-on-surface-variant flex items-center gap-2 ml-11">
                <Tag size={12} />
                {selectedLog.version}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {selectedLog.entries.map((entry, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-lg font-bold text-accent inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {entry.type}
                </h3>
                <ul className="space-y-3">
                  {entry.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed pl-4 relative">
                      <div className="absolute left-0 top-2 w-1 h-1 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selectedLog.entries.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Info size={40} className="mx-auto text-on-surface-variant opacity-20" />
              <p className="text-on-surface-variant italic">No specific entries for this release.</p>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
