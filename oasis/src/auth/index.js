export { default as Login } from './pages/Login';
export { default as Register } from './pages/Register';
export { default as ForgotPassword } from './pages/ForgotPassword';
export { default as VerifyEmail } from '../components/Registration/VerifyEmail';
export { default as SocialLogin } from './components/SocialLogin';

export { 
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  resetPassword,
  changePassword,
  loginWithGoogle,
  loginWithFacebook,
  getCurrentUser,
  getArabicErrorMessage
} from './auth.services';

export {
  auth,
  getFirebaseApp,
  getFirebaseAuth
} from './firebase.config';