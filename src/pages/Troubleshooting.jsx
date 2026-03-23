import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Bug, ShieldAlert, Zap, LifeBuoy, ArrowUpRight, Terminal, Settings, Smartphone, Copy, Check, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const supportLinks = [
  {
    title: "Telegram Support",
    description: "Our main community hub for xaga users. Ask questions and get help from the community.",
    icon: MessageCircle,
    href: "https://t.me/XAGASupport",
    color: "text-blue-400 bg-blue-400/10"
  },
  {
    title: "PixelOS Channel",
    description: "Official announcements, updates, and news for PixelOS on xaga.",
    icon: Zap,
    href: "https://t.me/PixelOS_xaga",
    color: "text-accent bg-accent/10"
  }
];

const faqs = [
  {
    question: "Safetynet / Play Integrity is failing?",
    answer: "PixelOS usually passes Play Integrity out of the box. If it fails, try clearing data of Play Store and Google Play Services. For more advanced fixes, check the Telegram group."
  },
  {
    question: "How to report a bug?",
    answer: "Always provide a logcat if possible. You can use apps like 'MatLog' or ADB to capture logs. Describe the issue, how to reproduce it, and your build version in the Telegram group."
  }
];

export default function Troubleshooting() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 pb-20">
      <section className="space-y-4">
        <h1 className="text-4xl font-brand font-bold">Support & Troubleshooting</h1>
        <p className="text-on-surface-variant max-w-2xl font-plain">
          Having issues or need help? Check the common solutions below or join our community.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-4 card-hover flex flex-col group"
          >
            <div className={cn("p-3 rounded-2xl w-fit", link.color)}>
              <link.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold flex items-center justify-between">
                {link.title}
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {link.description}
              </p>
            </div>
          </motion.a>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-brand font-bold flex items-center gap-2">
          <Terminal className="text-accent" size={24} />
          Collect a Logcat
        </h2>
        
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-3"
          >
            <h3 className="font-bold flex items-center gap-2 text-on-surface">
              <Smartphone size={18} className="text-accent" />
              Enable Developer options
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Open <span className="font-bold text-on-surface">Settings → About phone</span> and tap <span className="font-bold text-on-surface">Build number</span> seven times.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-3"
          >
            <h3 className="font-bold flex items-center gap-2 text-on-surface">
              <Settings size={18} className="text-accent" />
              Turn on USB debugging
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Open <span className="font-bold text-on-surface">Settings → System → Developer options</span>, then enable <span className="font-bold text-on-surface">USB debugging</span>.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-white/5 space-y-4"
          >
            <h3 className="font-bold flex items-center gap-2 text-on-surface">
              <Terminal size={18} className="text-accent" />
              Start logging from your PC
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Open the latest <span className="font-bold text-on-surface">ADB & Fastboot tools</span> on your computer and run this command:
            </p>
            
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 px-2 bg-surface text-[10px] font-bold text-on-surface-variant uppercase tracking-widest z-10">Command</div>
              <div className="flex items-center gap-2 bg-black/40 p-5 rounded-2xl border border-white/10 group-hover:border-accent/30 transition-colors">
                <code className="flex-1 font-mono text-sm text-accent whitespace-pre overflow-x-auto scrollbar-hide">adb logcat -b all &gt; logcat.log</code>
                <button 
                  onClick={() => copyToClipboard("adb logcat -b all > logcat.log")}
                  className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-accent transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-accent/5 p-6 rounded-3xl border border-accent/10 space-y-3"
          >
            <h3 className="font-bold flex items-center gap-2 text-accent">
              <Lightbulb size={18} />
              After logging
            </h3>
            <div className="text-sm text-on-surface-variant leading-relaxed space-y-2">
              <p>Reproduce the issue while <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-on-surface">adb logcat</code> is running, then press <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-on-surface font-bold uppercase">Ctrl + C</code> to stop logging.</p>
              <p>Share the generated <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-accent font-bold">logcat.log</code> file together with your issue report so support can inspect the failure properly.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-brand font-bold flex items-center gap-2">
          <HelpCircle className="text-accent" size={24} />
          Common Questions
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass p-6 rounded-3xl border border-white/5 space-y-3"
            >
              <h3 className="font-bold text-accent text-lg">{faq.question}</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass p-10 rounded-3xl border-red-500/20 bg-red-500/5">
        <div className="flex items-start gap-5 text-red-200">
          <ShieldAlert className="shrink-0" size={28} />
          <div className="space-y-3">
            <h3 className="font-bold text-xl">Disclaimer</h3>
            <p className="text-sm leading-relaxed opacity-90 font-plain">
              Modifying your device's software can lead to data loss or a bricked device if not done correctly. 
              The PixelOS team and the device maintainers are not responsible for any damage caused to your hardware. 
              Proceed at your own risk.
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant">
          <LifeBuoy size={14} />
          Still stuck? Ask nicely in the group.
        </div>
      </div>
    </div>
  );
}
