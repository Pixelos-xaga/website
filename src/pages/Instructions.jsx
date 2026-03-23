import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Info, AlertTriangle, ChevronRight, Zap, Download } from 'lucide-react';
import { useState } from 'react';
import { PLATFORM_TOOLS_CLI_COMMANDS, PLATFORM_TOOLS_ZIP_OPTIONS } from '../config';
import { cn } from '../lib/utils';

export default function Instructions() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const StepCard = ({ number, title, children, icon: Icon = Zap }) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative pl-12 pb-12 last:pb-0"
    >
      {/* Connector Line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/5 last:hidden" />
      
      {/* Number Badge */}
      <div className="absolute left-0 top-0 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center font-bold text-accent shadow-lg shadow-black/20 z-10">
        {number}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <Icon size={20} className="text-accent/60" />
          {title}
        </h3>
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-5 leading-relaxed text-base text-on-surface-variant">
          {children}
        </div>
      </div>
    </motion.div>
  );

  const CommandBox = ({ command, label }) => (
    <div className="space-y-2 group">
      {label && <div className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">{label}</div>}
      <div className="flex items-center gap-2 bg-black/40 p-5 rounded-2xl border border-white/5 group-hover:border-accent/20 transition-colors">
        <code className="flex-1 font-mono text-sm overflow-x-auto whitespace-pre scrollbar-hide">{command}</code>
        <button 
          onClick={() => copyToClipboard(command)}
          className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-accent transition-all active:scale-95"
        >
          {copied === command ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-4">
        <h1 className="text-4xl font-brand font-bold">Installation Guide</h1>
        <p className="text-on-surface-variant max-w-2xl">
          Follow these steps carefully to flash PixelOS on your device. 
          Unlocking your bootloader will wipe all data.
        </p>
      </section>

      <section className="space-y-8">
        <StepCard number="1" title="Prerequisites" icon={Info}>
          <ul className="list-disc pl-5 space-y-2">
            <li>Redmi K50i / Poco X4 GT (xaga) with an unlocked bootloader.</li>
            <li>A PC with ADB & Fastboot drivers installed.</li>
            <li>A high-quality USB cable (original is preferred).</li>
            <li>Backup all your data (internal storage will be wiped).</li>
          </ul>
        </StepCard>

        <StepCard number="2" title="Platform Tools" icon={Terminal}>
          <p>Install the official Android Platform-Tools for your operating system:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {PLATFORM_TOOLS_CLI_COMMANDS.map((cmd, i) => (
              <CommandBox key={i} label={cmd.title} command={cmd.command} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {PLATFORM_TOOLS_ZIP_OPTIONS.map((opt, i) => (
              <a 
                key={i}
                href={opt.href}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
              >
                <Download size={14} />
                {opt.name}
              </a>
            ))}
          </div>
        </StepCard>

        <StepCard number="3" title="Boot into Fastboot" icon={Zap}>
          <p>Power off your device and hold <strong>Volume Down + Power</strong> until the Fastboot logo appears. Connect it to your PC.</p>
          <CommandBox label="Verify Connection" command="fastboot devices" />
        </StepCard>

        <StepCard number="4" title="Flash Boot Images" icon={Zap}>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-3 text-amber-200 mb-4 items-center">
            <AlertTriangle className="shrink-0" size={24} />
            <p className="text-sm font-medium">Ensure you have the correct boot, vendor_boot, and dtbo images from the Downloads hub.</p>
          </div>
          <div className="space-y-4">
            <CommandBox command="fastboot flash boot boot.img" />
            <CommandBox command="fastboot flash vendor_boot vendor_boot.img" />
            <CommandBox command="fastboot flash dtbo dtbo.img" />
          </div>
        </StepCard>

        <StepCard number="5" title="Reboot to Recovery" icon={ChevronRight}>
          <p>Use the volume buttons to navigate to "Recovery Mode" and press Power, or use the command:</p>
          <CommandBox command="fastboot reboot recovery" />
        </StepCard>

        <StepCard number="6" title="Sideload ROM" icon={Terminal}>
          <p>In Recovery, go to <strong>Apply Update → Apply from ADB</strong>. Then run the following on your PC:</p>
          <CommandBox command="adb sideload PixelOS_xaga-xxx.zip" />
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex gap-3 text-blue-200 mt-4 items-center">
            <Info className="shrink-0" size={24} />
            <p className="text-sm font-medium">Wait for the process to finish. The terminal may stop at 47% or 94%, this is normal.</p>
          </div>
        </StepCard>

        <StepCard number="7" title="Format & Reboot" icon={Zap}>
          <p>After sideloading, go to <strong>Factory Reset → Format Data/Factory Reset</strong> and confirm. Finally, select <strong>Reboot System Now</strong>.</p>
          <div className="p-8 rounded-3xl bg-accent/20 border border-accent/30 text-center space-y-3">
            <h4 className="text-xl font-bold text-accent">Welcome to PixelOS!</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">The first boot may take a few minutes. Sit back and enjoy.</p>
          </div>
        </StepCard>
      </section>
    </div>
  );
}
