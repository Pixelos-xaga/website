import { motion } from 'framer-motion';
import { Download, ExternalLink, Shield, FileText, Globe, Box, Github } from 'lucide-react';
import { DOWNLOAD_SECTIONS } from '../config';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Downloads() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-4">
        <h1 className="text-4xl font-brand font-bold">Downloads</h1>
        <p className="text-on-surface-variant max-w-2xl">
          Get the latest builds of PixelOS for your device. 
          Always verify SHA256 checksums after downloading.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {DOWNLOAD_SECTIONS.map((section, idx) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {section.description && (
              <p className="text-base text-on-surface-variant bg-white/5 p-6 rounded-3xl border border-white/5 leading-relaxed">
                {section.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  className="glass p-5 rounded-3xl border border-white/5 space-y-4 group card-hover flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                        {item.icon === 'menu_book' ? <FileText size={20} /> : 
                         item.icon === 'system_update' ? <Box size={20} /> : 
                         item.icon === 'forum' ? <Globe size={20} /> :
                         <Download size={20} />}
                      </div>
                      <a 
                        href={item.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-white/5 transition-colors text-on-surface-variant hover:text-accent"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-lg">
                        {item.name}
                        {item.optional && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-on-surface-variant border border-white/10">
                            Optional
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {item.note || "Available for download"}
                      </p>
                    </div>
                  </div>

                  {item.sha256 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest">
                        <Shield size={12} />
                        SHA256 Checksum
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-black/40 px-3 py-1.5 rounded-xl text-[10px] font-mono text-on-surface-variant truncate">
                          {item.sha256}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(item.sha256)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-on-surface-variant"
                          title="Copy checksum"
                        >
                          {copied === item.sha256 ? (
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                              <Shield size={14} className="text-green-400" />
                            </motion.div>
                          ) : (
                            <FileText size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
