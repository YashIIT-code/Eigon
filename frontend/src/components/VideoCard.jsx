import { Link } from 'react-router-dom';
import { Play, Clock, MoreVertical, Loader2, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoCard({ video, delay = 0 }) {
  const isProcessing = ['pending', 'processing', 'generating_scenes', 'generating_images', 'generating_video', 'generating_narration', 'stitching', 'uploading'].includes(video.status);
  const isFailed = video.status === 'failed';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card overflow-hidden group flex flex-col h-full"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-dark-800 border-b border-white/5 overflow-hidden">
        {video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
            {isProcessing ? (
              <div className="flex flex-col items-center flex-col justify-center text-primary-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs font-medium tracking-wider uppercase">{video.status.replace('_', ' ')}</span>
              </div>
            ) : isFailed ? (
              <div className="text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                Failed to Render
              </div>
            ) : (
              <Film className="w-8 h-8 text-white/20" />
            )}
          </div>
        )}

        {/* Hover Action Overlay */}
        {!isProcessing && !isFailed && (
          <Link to={`/video/${video.id}`} className="absolute inset-0 bg-dark-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </Link>
        )}

        {/* Duration Badge */}
        {video.duration && !isProcessing && !isFailed && (
          <div className="absolute bottom-3 right-3 bg-dark-900/80 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white shadow-lg border border-white/10">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* Progress Bar (if processing) */}
        {isProcessing && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-dark-700">
            <div 
              className="h-full bg-primary-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${video.progress || 0}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-5 flex-grow flex flex-col justify-between hidden-card-info z-10 relative bg-dark-800/50">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/video/${video.id}`} className="block">
            <h3 className="text-white font-semibold truncate hover:text-primary-400 text-lg transition-colors">{video.title}</h3>
          </Link>
          <button className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          <span>{new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </motion.div>
  );
}
