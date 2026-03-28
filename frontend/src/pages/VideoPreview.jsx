import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Play, Video, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '../api/projects';
import ProgressBar from '../components/ProgressBar';

const PIPELINE_STEPS = [
  { id: 'pending', label: 'Queued', icon: Terminal },
  { id: 'generating_scenes', label: 'Analyzing Story & Scenes', icon: Terminal },
  { id: 'generating_images', label: 'Rendering Base Frames', icon: Terminal },
  { id: 'generating_video', label: 'Synthesizing Motion', icon: Terminal },
  { id: 'generating_narration', label: 'Generating Voiceover', icon: Terminal },
  { id: 'stitching', label: 'Audio/Video Assembly', icon: Terminal },
  { id: 'uploading', label: 'Finalizing Output', icon: Terminal },
  { id: 'completed', label: 'Ready', icon: CheckCircle2 },
];

export default function VideoPreview() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchJob = async () => {
      try {
        const { job } = await projectsApi.getOne(id);
        if (isMounted) setVideo(job);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.error?.message || 'Failed to load video project');
      }
    };

    fetchJob();
    
    // Poll for updates if not finished
    const interval = setInterval(() => {
      if (video && !['completed', 'failed'].includes(video.status)) {
        fetchJob();
      }
    }, 3000); // 3 second polling for more reactive UI

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, video?.status]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 inline-flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Project</h2>
          <p className="text-red-400">{error}</p>
          <Link to="/dashboard" className="btn-secondary mt-6 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!video) return null;

  const isComplete = video.status === 'completed';
  const isFailed = video.status === 'failed';
  
  // Find current step index
  const currentStepIndex = PIPELINE_STEPS.findIndex(s => s.id === video.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{video.title}</h1>
            <p className="text-gray-400">
              Style: <span className="text-gray-200 capitalize">{video.inputData?.settings?.style || 'Cinematic'}</span>
            </p>
          </div>
          {isComplete && (
            <div className="flex space-x-3">
              <button className="btn-secondary hidden sm:flex items-center">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </button>
              <button className="btn-primary flex items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Download className="w-4 h-4 mr-2" /> Download MP4
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-2 rounded-3xl shadow-2xl overflow-hidden aspect-video relative bg-dark-900/50 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5 mx-auto flex items-center justify-center">
            {isComplete && video.outputUrl ? (
              <video 
                src={video.outputUrl} 
                className="w-full h-full object-cover rounded-[1.25rem] bg-black"
                controls 
                autoPlay 
                poster={video.thumbnailUrl}
              />
            ) : isFailed ? (
              <div className="text-center p-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                <p className="text-red-400 max-w-sm mx-auto">{video.errorMessage || 'An unknown error occurred during pipeline execution.'}</p>
                <div className="mt-8 flex justify-center">
                  <button className="btn-secondary mr-2">Contact Support</button>
                  <Link to="/create" className="btn-primary">Try Again</Link>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 rounded-[1.25rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-dark-800/80 z-0"></div>
                
                {/* Simulated rendering placeholder */}
                {video.thumbnailUrl && (
                  <img src={video.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 blur-sm mix-blend-overlay" alt="" />
                )}

                <div className="relative z-10 w-full max-w-md">
                  <div className="w-24 h-24 bg-dark-900/50 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <Video className="w-10 h-10 text-primary-400 animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Engines Running</h3>
                  <p className="text-gray-400 mb-10">
                    {PIPELINE_STEPS[currentStepIndex > -1 ? currentStepIndex : 0]?.label || 'Initialising...'}
                  </p>

                  <ProgressBar progress={video.progress || 0} />
                  
                  <div className="flex justify-between mt-4 text-xs font-medium">
                    <span className="text-gray-500">{video.progress || 0}% Complete</span>
                    <span className="text-primary-400">ETA: ~2 mins</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status / Details */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Terminal className="w-4 h-4 mr-2 text-primary-400" />
              Pipeline Log
            </h3>
            
            <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {PIPELINE_STEPS.map((step, idx) => {
                const isActive = step.id === video.status;
                const isPast = currentStepIndex > idx || isComplete;
                const isPending = currentStepIndex < idx && !isComplete && !isFailed;
                
                return (
                  <div key={step.id} className="relative flex items-start group">
                    {/* Connecting line */}
                    {idx !== PIPELINE_STEPS.length - 1 && (
                      <div className={`absolute top-6 left-3.5 w-0.5 h-full -ml-[1px] transition-colors duration-500 rounded-full ${isPast ? 'bg-primary-500/50' : 'bg-dark-600'}`}></div>
                    )}
                    
                    {/* Status Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      {isPast ? (
                        <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center ring-1 ring-primary-500/50">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isActive ? (
                        <div className="w-7 h-7 rounded-full bg-dark-700 text-white flex items-center justify-center ring-2 ring-accent-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse"></div>
                        </div>
                      ) : isFailed && isActive ? (
						<div className="w-7 h-7 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center ring-1 ring-red-500/50">
                          <AlertCircle className="w-4 h-4" />
                        </div>
					  ) : (
                        <div className="w-7 h-7 rounded-full bg-dark-800 text-gray-600 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-white/30 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <div className="ml-4 flex flex-col pt-1.5">
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        isPast ? 'text-gray-300' 
                        : isActive ? 'text-white' 
                        : isFailed && isActive ? 'text-red-400'
                        : 'text-gray-600'
                      }`}>
                        {step.label}
                      </span>
                      <AnimatePresence>
                        {isActive && !isComplete && (
                          <motion.span 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-primary-400 mt-1"
                          >
                            In progress...
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
