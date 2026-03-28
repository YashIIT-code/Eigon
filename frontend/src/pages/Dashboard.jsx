import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Video, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import { projectsApi } from '../api/projects';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const data = await projectsApi.getAll();
      setVideos(data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    
    // Auto-refresh interval (polling for status updates)
    const interval = setInterval(() => {
      fetchVideos();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchVideos]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVideos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects Dashboard</h1>
          <p className="text-gray-400">Manage and view your generated cinematic stories.</p>
        </div>
        <div className="flex items-center space-x-4 mt-6 md:mt-0">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-white transition-colors bg-dark-800 rounded-lg hover:bg-dark-700 border border-white/5"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-primary-400' : ''}`} />
          </button>
          <Link to="/create" className="btn-primary py-2.5 px-6 rounded-lg text-sm flex items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Plus className="w-4 h-4 mr-2" />
            New Video
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Loading your projects...</p>
        </div>
      ) : videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-panel rounded-3xl"
        >
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/5">
            <Video className="w-10 h-10 text-primary-500/50" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No videos yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
            You haven&apos;t generated any videos yet. Start your first cinematic AI journey today.
          </p>
          <Link to="/create" className="btn-primary py-3 px-8 text-lg inline-flex items-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-5 h-5 mr-3" />
            Create Your First Video
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, idx) => (
            <VideoCard key={video.id} video={video} delay={idx * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
