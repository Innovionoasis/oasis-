import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getArabicErrorMessage } from '../../../auth/auth.services';
import { auth } from '../../../auth/firebase.config';
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

export default function RecoverpasswordOnePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionCode, setActionCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isActionCodeValid, setIsActionCodeValid] = useState(false);
  const [email, setEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

useEffect(() => {
  const verifyCode = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const oobCode = queryParams.get('oobCode');
      
      const storedCode = localStorage.getItem('resetPasswordCode');
      
      const codeToUse = oobCode || storedCode;
      
      console.log('رمز OOB المستلم:', codeToUse);
      
      if (!codeToUse) {
        setPasswordError("رمز إعادة تعيين كلمة المرور غير موجود");
        showErrorAlert("رمز إعادة تعيين كلمة المرور غير موجود أو انتهت صلاحيته");
        
        setTimeout(() => {
          navigate('/recoverpassword');
        }, 2000);
        return;
      }
      
      try {
        const emailAddress = await verifyPasswordResetCode(auth, codeToUse);
        console.log('البريد الإلكتروني المرتبط بالرمز:', emailAddress);
        
        setIsActionCodeValid(true);
        setEmail(emailAddress);
        setActionCode(codeToUse);
        
        localStorage.setItem('resetPasswordCode', codeToUse);
      } catch (error) {
        console.error("خطأ في التحقق من رمز إعادة تعيين كلمة المرور:", error);
        setPasswordError("انتهت صلاحية رابط إعادة تعيين كلمة المرور أو أنه غير صالح، يرجى طلب رابط جديد");
        
        localStorage.removeItem('resetPasswordCode');
        
        showErrorAlert("انتهت صلاحية رابط إعادة تعيين كلمة المرور أو أنه غير صالح");
        
        setTimeout(() => {
          navigate('/recoverpassword');
        }, 3000);
      }
    } finally {
      setInitialLoading(false);
    }
  };
  
  verifyCode();
}, [location, navigate]);

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        console.log("جاري الانتقال إلى صفحة تسجيل الدخول...");
        navigate("/login");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, navigate]);

  const validatePassword = (password) => {
    if (!password) {
      return "كلمة المرور مطلوبة";
    }
    
    if (password.length < 8) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
    }
    
    if (!/[0-9]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل";
    }
    
    return "";
  };

  const handleResetPassword = async (e) => {
    e && e.preventDefault();
    setPasswordError('');
    console.log("محاولة إعادة تعيين كلمة المرور");
    
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("كلمتا المرور غير متطابقتين");
      return;
    }
    
    if (!isActionCodeValid || !actionCode) {
      setPasswordError("رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية، يرجى طلب رابط جديد");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("إرسال طلب تأكيد إعادة تعيين كلمة المرور مع الرمز:", actionCode);
      await confirmPasswordReset(auth, actionCode, newPassword);
      console.log("تم تغيير كلمة المرور بنجاح!");
      
      setResetSuccess(true);
      
      showSuccessAlert("تم تعيين كلمة المرور الجديدة بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوانٍ...");
    } catch (error) {
      console.error("خطأ في تغيير كلمة المرور:", error);
      console.error("رمز الخطأ:", error.code);
      console.error("رسالة الخطأ:", error.message);
      
      const errorMsg = error.code ? getArabicErrorMessage(error.code) : "حدث خطأ أثناء إعادة تعيين كلمة المرور";
      setPasswordError(errorMsg);
      
      showErrorAlert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessAlert = (message) => {
    const alertElement = document.createElement('div');
    alertElement.className = 'fixed top-4 left-4 right-4 bg-green-100 border-r-4 border-green-500 text-green-900 p-3 rounded-lg flex items-center transition duration-300 ease-in-out z-50';
    alertElement.style.direction = 'rtl';
    
    alertElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 ml-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <p class="text-sm font-semibold">${message}</p>
    `;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
      if (document.body.contains(alertElement)) {
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          if (document.body.contains(alertElement)) {
            document.body.removeChild(alertElement);
          }
        }, 300);
      }
    }, 5000);
  };
  
  const showErrorAlert = (message) => {
    const alertElement = document.createElement('div');
    alertElement.className = 'fixed top-4 left-4 right-4 bg-red-100 border-r-4 border-red-500 text-red-900 p-3 rounded-lg flex items-center transition duration-300 ease-in-out z-50';
    alertElement.style.direction = 'rtl';
    
    alertElement.innerHTML = `
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-6 w-6 flex-shrink-0 ml-2 text-red-600">
        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
      </svg>
      <p class="text-sm font-semibold">${message}</p>
    `;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
      alertElement.style.opacity = '0';
      alertElement.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(alertElement);
      }, 300);
    }, 3000);
    
    setTimeout(() => {
      alertElement.style.transition = 'all 0.3s ease';
    }, 10);
  };

  if (initialLoading) {
    return (
      <div className="recovery-page">
        <div className="container">
          <h1 className="heading">تحقق من الرمز</h1>
          <div className="form">
            <div className="status-icon loading">
              <div className="loader"></div>
            </div>
            <p className="status-message">جاري التحقق من صلاحية الرمز...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>إعادة تعيين كلمة المرور - تأمين حسابك</title>
        <meta
          name="description"
          content="قم بإعادة تعيين كلمة المرور الخاصة بك بكل سهولة. أدخل كلمة المرور الجديدة وتأكيدها لاستعادة الوصول إلى حسابك."
        />
        <style>
          {`
          .container {
            max-width: 350px;
            background: #F8F9FD;
            background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
            border-radius: 40px;
            padding: 25px 35px;
            border: 5px solid rgb(255, 255, 255);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
            margin: 20px auto;
          }
          
          .heading {
            text-align: center;
            font-weight: 900;
            font-size: 30px;
            color: rgb(16, 137, 211);
            position: relative;
            margin-bottom: 25px;
          }
          
          .heading::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(to right, rgb(16, 137, 211), rgb(18, 177, 209));
            width: 80px;
            margin: 0 auto;
            border-radius: 2px;
          }
          
          .form {
            margin-top: 20px;
          }
          
          .form .input {
            width: 100%;
            background: white;
            border: none;
            padding: 15px 20px;
            border-radius: 20px;
            margin-top: 15px;
            box-shadow: #cff0ff 0px 10px 10px -5px;
            border-inline: 2px solid transparent;
          }
          
          .form .input::-moz-placeholder {
            color: rgb(170, 170, 170);
          }
          
          .form .input::placeholder {
            color: rgb(170, 170, 170);
          }
          
          .form .input:focus {
            outline: none;
            border-inline: 2px solid #12B1D1;
          }
          
          .form .login-button {
            display: block;
            width: 100%;
            font-weight: bold;
            background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
            color: white;
            padding-block: 15px;
            margin: 20px auto;
            border-radius: 20px;
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
            border: none;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
          }
          
          .form .login-button:hover {
            transform: scale(1.03);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
          }
          
          .form .login-button:active {
            transform: scale(0.95);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
          }
          
          .form .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .user-image-container {
            width: 90px;
            height: 90px;
            margin: 0 auto 20px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgb(16, 137, 211);
            padding: 2px;
            background-color: white;
          }
          
          .user-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
          
          .email-display {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
          }
          
          .error-text {
            color: #cc0000;
            font-size: 14px;
            text-align: right;
            margin-top: 5px;
          }
          
          .success-message {
            background-color: #e6ffe6;
            border-right: 4px solid #00cc00;
            color: #006600;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
            text-align: right;
            margin-top: 15px;
          }
          
          .recovery-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #f1f5f9;
            padding: 20px;
          }
          
          .page-title {
            font-size: 48px;
            font-weight: normal;
            margin-bottom: 20px;
            color: #333;
          }
          
          @media (max-width: 768px) {
            .page-title {
              font-size: 44px;
            }
          }
          
          @media (max-width: 640px) {
            .page-title {
              font-size: 38px;
            }
          }
          
          .password-input-container {
            position: relative;
          }
          
          .password-toggle-button {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
          }
          
          .password-requirements {
            margin-top: 10px;
            padding: 10px;
            background-color: #f8f8f8;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
            text-align: right;
          }
          
          .password-requirements ul {
            padding-right: 20px;
            margin: 5px 0;
          }
          
          .password-requirements li {
            margin-bottom: 3px;
          }
          
          .status-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 70px;
            height: 70px;
            margin: 0 auto 20px;
            border-radius: 50%;
          }
          
          .status-icon.loading {
            background-color: #f0f8ff;
          }
          
          .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .status-message {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
          }
          `}
        </style>
      </Helmet>

      <div className="recovery-page">
        <h1 className="page-title">إعادة تعيين كلمة المرور</h1>
        
        <div className="container">
          <div className="user-image-container">
            <img src="/images/img_user_male.png" alt="User" className="user-image" />
          </div>
          
          <h1 className="heading">تعيين كلمة المرور الجديدة</h1>
          
          {email && (
            <div className="email-display">
              البريد الإلكتروني: {email}
            </div>
          )}
          
          {passwordError && !resetSuccess && (
            <div className="error-text">
              {passwordError}
            </div>
          )}
          
          {resetSuccess ? (
            <div className="success-message">
              تم تغيير كلمة المرور بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول خلال لحظات...
            </div>
          ) : (
            <form className="form" onSubmit={handleResetPassword}>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  style={{ direction: 'rtl' }}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input"
                  placeholder="تأكيد كلمة المرور الجديدة"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  style={{ direction: 'rtl' }}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="password-requirements">
                <strong>متطلبات كلمة المرور:</strong>
                <ul>
                  <li>يجب أن تكون 8 أحرف على الأقل</li>
                  <li>تحتوي على حرف كبير واحد على الأقل</li>
                  <li>تحتوي على رقم واحد على الأقل</li>
                  <li>تحتوي على رمز خاص واحد على الأقل (مثل !@#$%^&*)</li>
                </ul>
              </div>
              
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting || !newPassword || !confirmPassword || !isActionCodeValid}
              >
                {isSubmitting ? "جاري المعالجة..." : "تعيين كلمة المرور الجديدة"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}