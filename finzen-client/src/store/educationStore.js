import { create } from 'zustand';
import { educationService } from '../services/educationService';

const educationStore = create((set, get) => ({
  // State
  modules: [],
  currentModule: null,
  progress: {},
  loading: false,
  error: null,

  // Actions
  setModules: (modules) => set({ modules }),
  setCurrentModule: (module) => set({ currentModule: module }),
  setProgress: (progress) => set({ progress }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async actions
  fetchModules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await educationService.getModules();
      set({ modules: response.modules, loading: false });
      return response;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  fetchModuleDetail: async (moduleId) => {
    set({ loading: true, error: null });
    try {
      const module = await educationService.getModuleDetail(moduleId);
      set({ currentModule: module, loading: false });
      return module;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  submitQuiz: async (moduleId, answers) => {
    set({ loading: true, error: null });
    try {
      const result = await educationService.submitQuiz(moduleId, answers);
      
      // Update module completion status
      const modules = get().modules.map(module => 
        module.moduleId === moduleId 
          ? { ...module, completed: result.passed, progress: result.score }
          : module
      );
      
      set({ modules, loading: false });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Computed values
  getCompletedModules: () => {
    const { modules } = get();
    return modules.filter(module => module.completed);
  },

  getCompletionPercentage: () => {
    const { modules } = get();
    if (modules.length === 0) return 0;
    const completed = modules.filter(module => module.completed).length;
    return (completed / modules.length) * 100;
  },

  getNextModule: () => {
    const { modules } = get();
    return modules.find(module => !module.completed);
  }
}));

export default educationStore;