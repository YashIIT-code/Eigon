import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full relative">
      {/* Track */}
      <div className="h-3 bg-dark-800 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
        {/* Fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-indigo-400 relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        >
          {/* Shimmer effect inside fill */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite] -skew-x-12 translate-x-full" />
        </motion.div>
      </div>
      
      {/* Glow under progress bar */}
      <motion.div 
        className="absolute top-1/2 left-0 h-10 -translate-y-1/2 bg-primary-500/20 rounded-full blur-xl -z-10"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      />
    </div>
  );
}
