import { Link } from 'react-router-dom';
import { Play, Sparkles, Video, Wand2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 md:p-8"
  >
    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-primary-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const PricingTier = ({ plan, highlight }) => (
  <div className={`glass-card p-8 md:p-10 relative overflow-hidden ${highlight ? 'border-primary-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : ''}`}>
    {highlight && (
      <div className="absolute top-0 right-0 py-1 px-4 bg-primary-500 text-xs font-bold uppercase tracking-wider text-white rounded-bl-lg">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
    <div className="flex items-baseline mb-6">
      <span className="text-4xl font-extrabold text-white">${plan.price}</span>
      <span className="text-gray-400 ml-2">/month</span>
    </div>
    <p className="text-gray-400 mb-8 h-12">{plan.desc}</p>
    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, i) => (
        <li key={i} className="flex items-start">
          <CheckCircle2 className="w-5 h-5 text-accent-500 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/signup" className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${highlight ? 'btn-primary' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
      {plan.cta}
    </Link>
  </div>
);

export default function Landing() {
  const features = [
    {
      icon: Sparkles,
      title: "Context-Aware Scenes",
      description: "Our LLM understands narrative structure, breaking your story into cohesive, perfectly timed scenes automatically."
    },
    {
      icon: Wand2,
      title: "Consistent Characters",
      description: "Define characters once and our advanced diffusion models maintain their appearance across every frame."
    },
    {
      icon: Video,
      title: "Cinematic Motion",
      description: "Apply dynamic camera movements and lifelike animations to your generated images with state-of-the-art video models."
    },
    {
      icon: Zap,
      title: "Lightning Fast Render",
      description: "Our distributed GPU cluster renders your final masterpiece in minutes, not hours."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: 19,
      desc: "Perfect for hobbyists and creators starting out.",
      cta: "Start Free Trial",
      features: [
        "15 videos per month",
        "Up to 2 minutes per video",
        "720p resolution rendering",
        "Standard generation speed",
        "Watermark on exports"
      ]
    },
    {
      name: "Pro",
      price: 49,
      desc: "For serious storytellers who need professional quality.",
      cta: "Upgrade to Pro",
      features: [
        "50 videos per month",
        "Up to 5 minutes per video",
        "1080p resolution rendering",
        "Priority GPU processing pool",
        "No watermarks",
        "Custom character traits upload"
      ]
    },
    {
      name: "Enterprise",
      price: 149,
      desc: "Unlimited power for studios and power users.",
      cta: "Contact Sales",
      features: [
        "Unlimited generation",
        "Up to 10 minutes per video",
        "4K resolution rendering",
        "Dedicated generation node",
        "API Access",
        "Team collaboration"
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-300">Eigon AI Engine 2.0 is live</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            >
              Words in, <span className="text-gradient">Movies out.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Type your story, define your characters, and let our generative AI pipeline create breathtaking, cinematic videos complete with voiceover and motion.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/signup" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2">
                <span>Start Creating Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2 group">
                <Play className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Preview Mockup */}
      <section className="relative -mt-10 pb-24 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="glass-panel p-2 rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden aspect-video relative group"
          >
            <img 
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop" 
              alt="Cinematic abstract visual" 
              className="w-full h-full object-cover rounded-xl md:rounded-[1.75rem]"
            />
            <div className="absolute inset-0 bg-dark-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all">
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">The Complete Pipeline</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to direct your vision, orchestrated behind a single button click.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard 
                key={idx} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                delay={idx * 0.1} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Choose the plan that fits your production needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <PricingTier 
                key={idx} 
                plan={plan} 
                highlight={idx === 1} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
