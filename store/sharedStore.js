import create from 'zustand';

const sharedStore = create((set) => ({
  currentUser: null,
  isLoading: false,
  setCurrentUser: (userData) => set({ currentUser: userData }),
  setIsLoading: (value) => set({ isLoading: value }),
}));

export default sharedStore;
