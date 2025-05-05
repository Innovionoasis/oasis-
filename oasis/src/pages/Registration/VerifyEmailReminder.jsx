import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '../../auth/firebase.config';
import { sendVerificationEmail } from '../../auth/auth.services';
import { getPathByRole } from '../../auth/auth.services';
import { showSuccessAlert, showErrorAlert } from './utils/alertUtils';

const VerifyEmailReminder = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { email, roleId } = location.state || {};
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleResendEmail = async () => {
    if (!canResend || !user) return;
    
    try {
      await sendVerificationEmail(user);
      showSuccessAlert('تم إعادة إرسال رابط التفعيل');
      setTimeLeft(120);
      setCanResend(false);
    } catch (error) {
      console.error('خطأ في إعادة إرسال البريد:', error);
      showErrorAlert('حدث خطأ أثناء إعادة إرسال رابط التفعيل');
    }
  };
  
  const handleCheckVerification = async () => {
    try {
      if (!user) {
        showErrorAlert('يرجى تسجيل الدخول أولاً');
        return;
      }
      
      await reload(user);
      
      if (user.emailVerified) {
        try {
          const roleName = location.state?.roleName || 
                         localStorage.getItem('userRole') || 
                         'مبتكر';
          
          const targetPath = getPathByRole(roleName);
          
          console.log('التوجيه إلى المسار:', targetPath, 'للدور:', roleName);
          
          navigate(targetPath, { replace: true });
        } catch (error) {
          console.error("خطأ في التوجيه حسب الدور:", error);
          showErrorAlert("فشل في التوجيه بعد التحقق من البريد.");
          navigate('/innovator');
        }
      } else {
        showErrorAlert('لم يتم تفعيل بريدك الإلكتروني بعد. يرجى التحقق من صندوق الوارد.');
      }
    } catch (error) {
      console.error('خطأ في التحقق من حالة التفعيل:', error);
      showErrorAlert('حدث خطأ أثناء التحقق من حالة التفعيل');
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }
  
  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-title">تأكيد البريد الإلكتروني</div>
        
        <p className="verification-message">
          تم إرسال بريد إلكتروني تفعيل إلى العنوان:
          <br />
          <span className="verification-email">{user?.email || email}</span>
          <br />
          يرجى النقر على الرابط في البريد الإلكتروني لتفعيل حسابك.
        </p>
        
        <div className="verification-actions">
          <button
            onClick={handleCheckVerification}
            className="verification-check-btn"
          >
            تم التحقق من بريدي الإلكتروني
          </button>
          
          <button
            onClick={handleResendEmail}
            disabled={!canResend}
            className="verification-resend-btn"
          >
            {canResend 
              ? "إعادة إرسال رابط التفعيل" 
              : `إعادة إرسال بعد (${formatTime(timeLeft)})`}
          </button>
        </div>
        
        <p className="verification-spam-note">
          إذا لم تجد البريد في صندوق الوارد، يرجى التحقق من مجلد البريد العشوائي (Spam).
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailReminder;