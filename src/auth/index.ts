export { ADMIN_EMAIL } from './constants';
export {
  initAuthPersistence,
  subscribeToAuth,
  isAdminUser,
  waitForAuthReady,
  loginAdmin,
  logoutAdmin,
  ensureAdminAuth,
  getAuthErrorMessage,
} from './session';
