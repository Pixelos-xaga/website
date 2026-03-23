import { motion } from 'framer-motion';
import { Terminal, Download, History, HelpCircle, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HOME_SCREENSHOTS } from '../home-screenshots';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

const features = [
  {
    title: "Install Guide",
    description: "Step-by-step flashing with copy actions for easy installation.",
    icon: Terminal,
    path: "/instructions",
    color: "bg-blue-500/10 text-blue-400",
    className: "md:col-span-2"
  },
  {
    title: "Download Hub",
    description: "ROM, boot, and vendor_boot entries.",
    icon: Download,
    path: "/downloads",
    color: "bg-accent/10 text-accent",
    className: "md:col-span-1"
  },
  {
    title: "Changelogs",
    description: "Track latest ROM updates and fixes.",
    icon: History,
    path: "/changelogs",
    color: "bg-purple-500/10 text-purple-400",
    className: "md:col-span-1"
  },
  {
    title: "Support",
    description: "Reporting issues, logcats, and support basics.",
    icon: HelpCircle,
    path: "/support",
    color: "bg-amber-500/10 text-amber-400",
    className: "md:col-span-2"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#screenshots') {
      const element = document.getElementById('screenshots');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold"
        >
          <ShieldCheck size={14} />
          Official Device Hub
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-brand font-bold tracking-tight"
        >
          PixelOS for <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">Xaga</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-on-surface-variant max-w-2xl mx-auto font-plain leading-relaxed"
        >
          PixelOS A16 for xaga (Redmi K50i, Poco X4 GT, Redmi Note 11T Pro/Pro+).
          Experience the pure Pixel feel on your Dimensity 8100 beast.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link 
            to="/instructions"
            className="px-8 py-3.5 rounded-full bg-accent text-on-brand font-bold flex items-center gap-2 hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
          >
            <Terminal size={18} />
            Get Started
          </Link>
          <Link 
            to="/downloads"
            className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Download size={18} />
            Downloads
          </Link>
        </motion.div>
      </section>

      {/* Screenshots Carousel */}
      <section id="screenshots" className="space-y-6 scroll-mt-24">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('#screenshots')}
            className="text-2xl font-brand font-bold flex items-center gap-2 group cursor-pointer hover:text-accent transition-colors"
          >
            <Zap className="text-accent group-hover:scale-110 transition-transform" size={24} />
            Screenshots
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mask-fade-edges">
          {HOME_SCREENSHOTS.map((shot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex-shrink-0 w-48 aspect-[9/19.5] rounded-2xl overflow-hidden glass border border-white/10 shadow-xl group cursor-zoom-in"
            >
              <img 
                src={shot.src} 
                alt={shot.alt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-brand font-bold">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link 
                to={feature.path}
                className={cn(
                  "block h-full glass p-8 rounded-3xl space-y-4 card-hover relative overflow-hidden group",
                  feature.className
                )}
              >
                <div className={cn("p-3 rounded-2xl w-fit", feature.color)}>
                  <feature.icon size={26} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    {feature.title}
                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="text-center pt-10 pb-10">
        <div className="glass p-12 rounded-3xl max-w-3xl mx-auto border-accent/20">
          <Heart className="mx-auto text-accent mb-6" size={40} />
          <h2 className="text-3xl font-bold mb-4">Community Driven</h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            <a href="https://pixelos.net/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline decoration-accent/30 underline-offset-4 font-bold transition-all">PixelOS</a> is a community-driven project maintained by a group of enthusiasts from all over the world.
            Join the community for support and updates.
          </p>
        </div>
      </section>
    </div>
  );
}
