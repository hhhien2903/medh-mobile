import create from 'zustand';

const sharedStore = create((set) => ({
  currentUser: null,
  isNotRegistered: false,
  tokenTest: '',
  isLoadingSpinnerOverLay: false,
  isShowRegisterSuccessfulAlert: false,
  isShowDisabledAlert: false,
  setCurrentUser: (userData) => set({ currentUser: userData }),
  setIsNotRegistered: (value) => set({ isNotRegistered: value }),
  setTokenTest: (token) => set({ tokenTest: token }),
  setIsLoadingSpinnerOverLay: (value) => set({ isLoadingSpinnerOverLay: value }),
  setIsShowRegisterSuccessfulAlert: (value) => set({ isShowRegisterSuccessfulAlert: value }),
  setIsShowDisabledAlert: (value) => set({ isShowDisabledAlert: value }),
}));

export default sharedStore;
