// src/pages/Registration/OTPVerification.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPathByRole } from '../../auth/auth.services';
import { reload } from 'firebase/auth';
import { auth } from '../../auth/firebase.config';
import { showSuccessAlert, showErrorAlert } from './utils/alertUtils';
import { 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../../auth/firebase.config';

const OTPVerification = ({
  email,      
  roleId,     
  onBack,     
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCheckVerification = async () => {
    try {
      setIsSubmitting(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        showErrorAlert('يرجى تسجيل الدخول أولاً');
        return;
      }
      
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        const roleName = roleId || localStorage.getItem('userRole') || 'مبتكر';
        
        const targetPath = getPathByRole(roleName);
        console.log('التوجيه إلى المسار:', targetPath, 'للدور:', roleName);
        
        navigate(targetPath, { replace: true });
        return;
      } else {
        showErrorAlert('لم يتم تفعيل بريدك الإلكتروني بعد');
      }
    } catch (error) {
      console.error('خطأ في التحقق:', error);
      showErrorAlert('حدث خطأ أثناء التحقق');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f5f8fb',
      direction: 'rtl'
    },
    
    cardContainer: {
      width: '450px',
      maxWidth: '100%',
      background: 'linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)',
      borderRadius: '25px',
      padding: '30px',
      border: '5px solid rgb(255, 255, 255)',
      boxShadow: 'rgba(133, 189, 215, 0.6) 0px 20px 25px -15px',
      margin: '0 auto',
      textAlign: 'center'
    },
    
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    
    backButton: {
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      background: 'none',
      color: 'rgb(16, 137, 211)',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    
    title: {
      fontWeight: '800',
      fontSize: '28px',
      color: 'rgb(16, 137, 211)',
      margin: '0 0 25px 0',
      width: '100%'
    },
    
    emailIcon: {
      color: 'rgb(16, 137, 211)',
      margin: '25px 0',
      display: 'flex',
      justifyContent: 'center'
    },
    
    messageContainer: {
      margin: '0 0 30px 0'
    },
    
    message: {
      color: 'rgb(85, 85, 85)',
      lineHeight: '1.8',
      marginBottom: '15px',
      fontSize: '16px'
    },
    
    emailDisplay: {
      display: 'block',
      fontWeight: 'bold',
      color: 'rgb(16, 137, 211)',
      margin: '15px 0',
      direction: 'ltr',
      textAlign: 'center',
      fontSize: '18px',
      padding: '10px',
      backgroundColor: 'rgba(16, 137, 211, 0.05)',
      borderRadius: '8px'
    },
    
    actionButton: {
      width: '100%',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)',
      color: 'white',
      padding: '15px 0',
      margin: '30px 0 20px 0',
      borderRadius: '15px',
      boxShadow: 'rgba(133, 189, 215, 0.5) 0px 10px 15px -5px',
      border: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontSize: '16px'
    },
    
    disabledButton: {
      opacity: '0.7',
      cursor: 'not-allowed'
    },
    
    spamNote: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      color: '#777',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardContainer}>
        <div style={styles.header}>
          <button
            onClick={onBack}
            style={styles.backButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px', transform: 'rotate(180deg)' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            العودة
          </button>
        </div>
        
        <h1 style={styles.title}>
          التحقق من البريد الإلكتروني
        </h1>
        
        <div style={styles.emailIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        
        <div style={styles.messageContainer}>
          <p style={styles.message}>
            تم إرسال رابط تفعيل إلى بريدك الإلكتروني
          </p>
          
          <span style={styles.emailDisplay}>
            {email}
          </span>
          
          <p style={styles.message}>
            يرجى فتح البريد والنقر على الرابط لتفعيل حسابك
          </p>
        </div>
        
        <button
          style={{
            ...styles.actionButton,
            ...(isSubmitting ? styles.disabledButton : {})
          }}
          onClick={handleCheckVerification}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري التحقق..." : "تم تفعيل بريدي الإلكتروني"}
        </button>
        
        <a 
          href="#"
          style={styles.spamNote}
        >
          إذا لم تجد البريد في صندوق الوارد، يرجى التحقق من مجلد البريد العشوائي (Spam)
        </a>
      </div>
    </div>
  );
};

export default OTPVerification;