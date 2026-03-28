import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects, error: null }),
  setCurrentProject: (project) => set({ currentProject: project, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  
  updateProjectProgress: (id, progressData) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...progressData } : p),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...progressData } 
      : state.currentProject
  }))
}));
