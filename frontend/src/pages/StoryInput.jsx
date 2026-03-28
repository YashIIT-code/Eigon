import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Mic, Loader2, Music, Clapperboard, Text } from 'lucide-react';
import { motion } from 'framer-motion';
import { projectsApi } from '../api/projects';

export default function StoryInput() {
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({ title: '', story: '', style: 'cinematic' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const styles = [
    { id: 'cinematic', label: 'Cinematic Movie' },
    { id: 'anime', label: 'Anime/Manga' },
    { id: '3d_animation', label: '3D Animation' },
    { id: 'watercolor', label: 'Watercolor Fantasy' },
    { id: 'cyberpunk', label: 'Cyberpunk Sci-Fi' },
    { id: 'comic', label: 'Comic Book' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.story && !audioFile) return;

    setIsSubmitting(true);
    try {
      // In a real app with audio, we'd use FormData to upload the file first or inline
      // Here we just send the text payload (or mock audio processing)
      const data = {
        title: formData.title || 'Untitled Generation',
        type: activeTab === 'text' ? 'text_to_video' : 'audio_to_video',
        story: formData.story || 'Generated from audio', // mock
        settings: { style: formData.style }
      };

      const { job } = await projectsApi.create(data);
      navigate(`/video/${job.id}`);
    } catch (err) {
      console.error('Failed to submit job:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Clapperboard className="w-8 h-8 mr-3 text-primary-400" />
          Create New Video
        </h1>
        <p className="text-gray-400 text-lg">Input your script or upload an audio narration to begin.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
            <label className="label-text text-base">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. The Last Citadel"
              className="input-field text-lg font-medium border-white/10 bg-dark-800/80 focus:bg-dark-800"
              required
            />
          </div>

          <div>
            <div className="flex items-center space-x-1 mb-4 bg-dark-800 p-1.5 rounded-xl border border-white/5 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'text' 
                    ? 'bg-dark-600 text-white shadow-md border border-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Text className="w-4 h-4" />
                <span>Text Script</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audio')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'audio' 
                    ? 'bg-dark-600 text-white shadow-md border border-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Audio Upload</span>
              </button>
            </div>

            {activeTab === 'text' ? (
              <div className="relative">
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Once upon a time in a cyberpunk city drenched in neon rain..."
                  className="input-field min-h-[250px] resize-y py-4 leading-relaxed border-white/10 bg-dark-800/80 focus:bg-dark-800 transition-colors"
                  required={activeTab === 'text'}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs text-gray-500 px-3 py-1 bg-dark-900/60 backdrop-blur rounded-full border border-white/5">
                  <Wand2 className="w-3.5 h-3.5 text-primary-400" />
                  <span>AI Prompt Enhanced</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center bg-dark-800/50 hover:bg-dark-800 hover:border-primary-500/30 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                />
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-colors">
                  <Music className="w-8 h-8 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {audioFile ? audioFile.name : 'Click to select audio or drag & drop'}
                </h3>
                <p className="text-gray-500">MP3, WAV, M4A up to 50MB</p>
                {audioFile && <p className="text-primary-400 font-medium mt-4 text-sm mt-2">File attached successfully</p>}
              </div>
            )}
          </div>

          <div>
            <label className="label-text text-base mb-3">Visual Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {styles.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, style: style.id })}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    formData.style === style.id
                      ? 'bg-primary-500/20 border-primary-500 text-white ring-1 ring-primary-500/50'
                      : 'bg-dark-800 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-dark-700 hover:border-white/20'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/5 mt-8">
            <button
              type="submit"
              disabled={isSubmitting || (activeTab === 'text' && !formData.story) || (activeTab === 'audio' && !audioFile)}
              className="btn-primary py-3.5 px-10 text-lg flex items-center space-x-3 w-full sm:w-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Starting Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
