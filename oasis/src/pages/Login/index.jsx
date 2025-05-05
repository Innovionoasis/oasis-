import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {loginWithEmail, getUserRoleAndPath, getArabicErrorMessage, sendVerificationEmail,getPathByRole    } from "../../auth/auth.services";
import "../../auth/styles/auth.css";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../../auth/firebase.config';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const isVerified = queryParams.get('verified') === 'true';
    
    if (isVerified) {
      showSuccessAlert('تم تفعيل بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول');
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    if (lockTimeLeft > 0) {
      const timer = setTimeout(() => {
        setLockTimeLeft(lockTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockTimeLeft === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockTimeLeft, isLocked]);

  useEffect(() => {
    const lockedUntil = localStorage.getItem('lockedUntil');
    if (lockedUntil) {
      const lockTime = parseInt(lockedUntil);
      const now = new Date().getTime();
      if (now < lockTime) {
        const remainingSeconds = Math.floor((lockTime - now) / 1000);
        setIsLocked(true);
        setLockTimeLeft(remainingSeconds);
      } else {
        localStorage.removeItem('lockedUntil');
      }
    }
    
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      rememberMe: e.target.checked
    });
  };


const handleLogin = async () => {
  if (isLocked) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setErrorMessage("الرجاء إدخال بريد إلكتروني صحيح");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    return;
  }

  if (formData.password.length < 6) {
    setErrorMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("محاولة تسجيل الدخول للمستخدم:", formData.email);
    
    const result = await loginWithEmail(formData.email, formData.password);
    const { user, error } = result;
    const userRole = result.role || 'innovator';
    
    console.log("نتيجة تسجيل الدخول:", { 
      userExists: !!user, 
      userRole: userRole, 
      hasError: !!error 
    });

    if (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      let message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = `بيانات الدخول غير صحيحة. محاولة ${newAttempts} من 3`;
      } else if (error.code === 'auth/too-many-requests') {
        message = "تم تجاوز عدد محاولات تسجيل الدخول المسموح بها. الرجاء المحاولة لاحقًا";
      } else {
        message = getArabicErrorMessage(error.code) || `خطأ في تسجيل الدخول: ${error.message}`;
      }

      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);

      showErrorAlert(newAttempts < 3 ?
        `بيانات الدخول غير صحيحة. محاولة ${newAttempts} من 3` :
        "حاول مجدداً بعد عشر دقائق"
      );

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimeLeft(600);
        const lockUntil = new Date().getTime() + (600 * 1000);
        localStorage.setItem('lockedUntil', lockUntil.toString());
      }
    } else {
      localStorage.removeItem('loginAttempts');

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        showSuccessAlert("تم إرسال رابط التحقق إلى بريدك الإلكتروني");
        setTimeout(() => {
          navigate('/verify-email-reminder', {
            state: { email: user.email }
          });
        }, 1000);
        setIsSubmitting(false);
        return;
      }

      if (formData.rememberMe) {
        localStorage.setItem('userEmail', formData.email);
      }

      console.log("البريد الإلكتروني مفعل، دور المستخدم:", userRole);
      
      localStorage.setItem('userRole', userRole);
      console.log("تم حفظ الدور في localStorage:", userRole);
      
      const targetPath = getPathByRole(userRole);
      console.log("المسار المستهدف بناءً على الدور:", targetPath);
      
      showSuccessAlert(`تم تسجيل الدخول بنجاح كـ ${userRole}`);
      
      setTimeout(() => {
        console.log("توجيه المستخدم إلى:", targetPath);
        navigate(targetPath);
      }, 1500);
    }
  } catch (error) {
    console.error("خطأ غير متوقع أثناء تسجيل الدخول:", error);
    setErrorMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  } finally {
    setIsSubmitting(false);
  }
};


  const determineUserRoleAndRedirect = async (user) => {
    let userRole = null;
    let redirectPath = null;
    
    try {
      const response = await fetch(`http://localhost:4000/api/useraccount-by-email?email=${user.email}`);
      if (response.ok) {
        const pgUser = await response.json();
        userRole = pgUser.currentroles || null;
        
        if (userRole) {
          console.log("تم جلب الدور من PostgreSQL:", userRole);
        }
      }
    } catch (err) {
      console.error("خطأ في جلب الدور من قاعدة البيانات PostgreSQL:", err);
    }
    
    if (!userRole) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          userRole = userData.role || userData.role_name || userData.role_id;
          
          if (userRole) {
            console.log("تم جلب الدور من Firestore:", userRole);
          }
        }
      } catch (firestoreError) {
        console.error("خطأ في جلب بيانات المستخدم من Firestore:", firestoreError);
      }
    }
    
    if (!userRole) {
      userRole = "Innovator";
      console.log("استخدام الدور الافتراضي:", userRole);
    }
    
    redirectPath = getPathByRole(userRole);
    
    try {
      await setDoc(doc(db, "users", user.uid), {
        role: userRole,
        role_name: userRole,
        last_login: serverTimestamp()
      }, { merge: true });
      
      sessionStorage.setItem("userRole", userRole);
    } catch (updateError) {
      console.error("خطأ في تحديث بيانات الدور:", updateError);
    }
    
    showSuccessAlert("تم تسجيل الدخول بنجاح");
    setTimeout(() => {
      navigate(redirectPath);
    }, 1000);
  };

  const showSuccessAlert = (message) => {
    const alertElement = document.createElement('div');
    alertElement.className = 'fixed top-4 left-4 right-4 bg-green-100 border-r-4 border-green-500 text-green-900 p-3 rounded-lg flex items-center transition duration-300 ease-in-out z-50';
    alertElement.style.direction = 'rtl';
    
    alertElement.innerHTML = `
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-6 w-6 flex-shrink-0 ml-2 text-green-600">
        <path d="M5 13l4 4L19 7" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
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

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && emailRegex.test(formData.email)) {
      try {
        setIsSubmitting(true);
        await sendPasswordResetEmail(auth, formData.email);
        showSuccessAlert("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني");
        setIsSubmitting(false);
      } catch (error) {
        console.error("خطأ في إرسال بريد استعادة كلمة المرور:", error);
        showErrorAlert(getArabicErrorMessage(error.code) || "حدث خطأ أثناء محاولة استعادة كلمة المرور");
        setIsSubmitting(false);
      }
    } else {
      navigate('/Recoverpassword');
    }
  };

  const handleRegister = () => {
    navigate('/Registration');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <>
      <Helmet>
        <title>User Login - Access Your Account</title>
        <meta
          name="description"
          content="Log in to your account using your email and password. Forgot your password? Reset it easily and continue to explore the Innovation Oasis."
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
            margin: 20px;
          }

          .heading {
            text-align: center;
            font-weight: 900;
            font-size: 30px;
            color: rgb(16, 137, 211);
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

          .form .forgot-password {
            display: block;
            margin-top: 10px;
            margin-left: 10px;
          }

          .form .forgot-password a {
            font-size: 11px;
            color: #0099ff;
            text-decoration: none;
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
          }

          .form .login-button:hover {
            transform: scale(1.03);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
          }

          .form .login-button:active {
            transform: scale(0.95);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
          }

          .social-account-container {
            margin-top: 25px;
          }

          .social-account-container .title {
            display: block;
            text-align: center;
            font-size: 10px;
            color: rgb(170, 170, 170);
          }

          .social-account-container .social-accounts {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 5px;
          }

          .social-account-container .social-accounts .social-button {
            background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
            border: 5px solid white;
            padding: 5px;
            border-radius: 50%;
            width: 40px;
            aspect-ratio: 1;
            display: grid;
            place-content: center;
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
            transition: all 0.2s ease-in-out;
          }

          .social-account-container .social-accounts .social-button .svg {
            fill: white;
            margin: auto;
          }

          .social-account-container .social-accounts .social-button:hover {
            transform: scale(1.2);
          }

          .social-account-container .social-accounts .social-button:active {
            transform: scale(0.9);
          }

          .agreement {
            display: block;
            text-align: center;
            margin-top: 15px;
          }

          .agreement a {
            text-decoration: none;
            color: #0099ff;
            font-size: 9px;
          }

          .error-message {
            background-color: #ffebeb;
            border-right: 4px solid #ff3333;
            color: #ff0000;
            padding: 10px;
            border-radius: 10px;
            margin-top: 15px;
            font-size: 12px;
            text-align: right;
            direction: rtl;
          }

          .checkbox-container {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 10px;
            gap: 8px;
          }

          .checkbox-container label {
            font-size: 12px;
            color: #666;
          }

          .checkbox-container input {
            width: 16px;
            height: 16px;
          }

          body {
            background-color: #f1f5f9;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          `}
        </style>
      </Helmet>
      
      <div className="container">
        <h1 className="heading">تسجيل الدخول</h1>
        
        <div className="form">
          <input 
            type="email" 
            className="input" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="البريد الإلكتروني"
            disabled={isLocked}
            dir="rtl"
          />
          
          <div className="relative" style={{ width: "100%" }}>
  <input 
    type={showPassword ? "text" : "password"} 
    className="input" 
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    placeholder="كلمة المرور"
    disabled={isLocked}
    dir="rtl"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
    style={{ background: "none", border: "none" }}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right',flexDirection: 'row-reverse' }}>
            <div className="forgot-password">
              <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>نسيت كلمة المرور</a>
            </div>
            
            <div className="checkbox-container" style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', gap: '8px',flexDirection: 'row-reverse' }}>
              <label>تذكرني</label>
              <input 
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleCheckboxChange}
                disabled={isLocked}
              />
            </div>
          </div>
          
          {isLocked && (
            <div className="error-message">
              حاول مجددا بعد {formatTime(lockTimeLeft)}
            </div>
          )}
          
          {showError && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isSubmitting || isLocked}
          >
            {isSubmitting ? "جاري تسجيل الدخول..." : "متابعة"}
          </button>
        </div>
        
       {/*<SocialLogin 
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />*/}
        
        <div className="agreement">
          <a href="#" onClick={(e) => { e.preventDefault(); handleRegister(); }}>ليس لديك حساب؟ تسجيل جديد</a>
        </div>
      </div>
    </>
  );
}