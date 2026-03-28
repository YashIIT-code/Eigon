import { useState, useEffect } from 'react';
import { Plus, User, Image as ImageIcon, Sparkles, X, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { charactersApi } from '../api/characters';

export default function CharacterStudio() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    traits: { age: '', hair: '', clothing: '', vibe: '' }
  });

  const fetchCharacters = async () => {
    try {
      const data = await charactersApi.getAll();
      setCharacters(data.characters || []);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await charactersApi.create(formData);
      await fetchCharacters();
      setIsModalOpen(false);
      setFormData({ name: '', description: '', traits: { age: '', hair: '', clothing: '', vibe: '' } });
    } catch (err) {
      console.error('Create character failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this character?')) return;
    try {
      await charactersApi.delete(id);
      setCharacters(characters.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete character failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <User className="w-8 h-8 mr-3 text-accent-500" />
            Character Studio
          </h1>
          <p className="text-gray-400 text-lg">Define your recurring characters for consistent AI video generation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 px-6 rounded-lg text-sm flex items-center shadow-[0_0_15px_rgba(236,72,153,0.3)] mt-6 sm:mt-0 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Character
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-accent-500/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No characters defined</h3>
          <p className="text-gray-400 mb-6">Create characters to maintain visual consistency across your videos.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-secondary">
            Create First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char, idx) => (
            <motion.div 
              key={char.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-48 bg-dark-800 relative flex items-center justify-center group-hover:bg-dark-700 transition-colors">
                {char.imageUrl ? (
                  <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white/10" />
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(char.id)} className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                  {char.name}
                  <Sparkles className="w-3.5 h-3.5 text-accent-500 ml-2" />
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{char.description || 'No description provided.'}</p>
                <div className="space-y-2">
                  <div className="flex text-xs">
                    <span className="text-gray-500 w-16">Age/Hair:</span>
                    <span className="text-gray-300 font-medium">{char.traits?.age || 'N/A'}, {char.traits?.hair || 'N/A'}</span>
                  </div>
                  <div className="flex text-xs">
                    <span className="text-gray-500 w-16">Style:</span>
                    <span className="text-gray-300 font-medium">{char.traits?.clothing || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-2xl overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel w-full max-w-xl rounded-2xl p-6 relative border border-white/20 my-8"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Create Character Origin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">Character Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-field bg-dark-800 focus:bg-dark-900 border-white/10"
                  placeholder="e.g. Elena Vance"
                />
              </div>

              <div>
                <label className="label-text">Core Identity (Prompt Base)</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="input-field bg-dark-800 focus:bg-dark-900 border-white/10 min-h-[100px] resize-y"
                  placeholder="A seasoned detective with a sharp gaze and weary posture."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Age & Origin</label>
                  <input 
                    type="text" 
                    value={formData.traits.age}
                    onChange={e => setFormData({...formData, traits: {...formData.traits, age: e.target.value}})}
                    className="input-field bg-dark-800 focus:bg-dark-900 border-white/10 text-sm"
                    placeholder="e.g. 30s, Cybernetic"
                  />
                </div>
                <div>
                  <label className="label-text">Hair & Features</label>
                  <input 
                    type="text" 
                    value={formData.traits.hair}
                    onChange={e => setFormData({...formData, traits: {...formData.traits, hair: e.target.value}})}
                    className="input-field bg-dark-800 focus:bg-dark-900 border-white/10 text-sm"
                    placeholder="e.g. Short neon red"
                  />
                </div>
                <div>
                  <label className="label-text">Signature Clothing</label>
                  <input 
                    type="text" 
                    value={formData.traits.clothing}
                    onChange={e => setFormData({...formData, traits: {...formData.traits, clothing: e.target.value}})}
                    className="input-field bg-dark-800 focus:bg-dark-900 border-white/10 text-sm"
                    placeholder="e.g. Leather trenchcoat"
                  />
                </div>
                <div>
                  <label className="label-text">Overall Vibe</label>
                  <input 
                    type="text" 
                    value={formData.traits.vibe}
                    onChange={e => setFormData({...formData, traits: {...formData.traits, vibe: e.target.value}})}
                    className="input-field bg-dark-800 focus:bg-dark-900 border-white/10 text-sm"
                    placeholder="e.g. Intimidating, mysterious"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-end">
                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary flex items-center bg-gradient-to-r from-accent-500 to-primary-500 w-full sm:w-auto justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Character Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
