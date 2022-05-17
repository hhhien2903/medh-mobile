import create from 'zustand';
import pushDeviceAPI from '../api/pushDeviceAPI';

const sharedStore = create((set) => ({
  currentUser: null,
  isNotRegistered: false,
  tokenPushDevice: '',
  isLoadingSpinnerOverLay: false,
  isShowRegisterSuccessfulAlert: false,
  isShowDisabledAlert: false,
  filterTreatedMedicalRecord: 'false',
  isVisibleNotificationBadge: null,
  notificationsSource: [],
  isVisibleAlertDialog: false,
  dialogUsedFor: null,
  isShowEndMedicalRecord: false,
  selectedMedicalRecordDetail: null,
  setCurrentUser: (userData) => set({ currentUser: userData }),
  setIsNotRegistered: (value) => set({ isNotRegistered: value }),
  setTokenPushDevice: (token) => set({ tokenPushDevice: token }),
  setIsLoadingSpinnerOverLay: (value) => set({ isLoadingSpinnerOverLay: value }),
  setIsShowRegisterSuccessfulAlert: (value) => set({ isShowRegisterSuccessfulAlert: value }),
  setIsShowDisabledAlert: (value) => set({ isShowDisabledAlert: value }),
  setFilterTreatedMedicalRecord: (value) => set({ filterTreatedMedicalRecord: value }),
  setNotificationsSource: (value) => set({ notificationsSource: value }),
  setIsVisibleNotificationBadge: (value) => set({ isVisibleNotificationBadge: value }),
  setIsVisibleAlertDialog: (value) => set({ isVisibleAlertDialog: value }),
  setDialogUsedFor: (value) => set({ dialogUsedFor: value }),
  setIsShowEndMedicalRecord: (value) => set({ isShowEndMedicalRecord: value }),
  setSelectedMedicalRecordDetail: (value) => set({ selectedMedicalRecordDetail: value }),
  getAllNotification: async (doctorId) => {
    try {
      const notificationResult = await pushDeviceAPI.getNotificationByDoctorId(doctorId);
      // setNotificationsSource(notificationResult);
      set({ notificationsSource: notificationResult });
      //If find any notification unread, visible badge
      if (notificationResult.find((notification) => notification.isRead === false)) {
        set({ isVisibleNotificationBadge: '' });
      } else {
        set({ isVisibleNotificationBadge: null });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));

export default sharedStore;
