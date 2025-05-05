import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword, getArabicErrorMessage } from "../../auth/auth.services";

export default function RecoverpasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return "البريد الإلكتروني مطلوب";
    }
    
    if (!emailRegex.test(email)) {
      return "الرجاء إدخال بريد إلكتروني صحيح";
    }
    
    return "";
  };

const handleRequestReset = async () => {
  const emailError = validateEmail(email);
  console.log("محاولة إرسال طلب استعادة كلمة المرور لـ:", email);
  if (emailError) {
    setErrorMessage(emailError);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    console.log("جاري إرسال طلب استعادة كلمة المرور لـ:", email);
    
    const { success, error } = await resetPassword(email);
    
    if (error) {
      console.error("خطأ في إرسال طلب استعادة كلمة المرور:", error);
      throw error;
    }
    
    console.log("تم إرسال طلب استعادة كلمة المرور بنجاح");
    
    showSuccessAlert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    setResetLinkSent(true);
    
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  } catch (error) {
    console.error("Error sending reset email:", error);
    
    const errorMsg = error.code ? getArabicErrorMessage(error.code) : "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور";
    setErrorMessage(errorMsg);
    setShowError(true);
    
    setTimeout(() => {
      setShowError(false);
    }, 3000);
    
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

  return (
    <>
      <Helmet>
        <title>استعادة كلمة المرور</title>
        <meta
          name="description"
          content="استعادة كلمة المرور - أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور"
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
          
          .description {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 500;
          }
          
          .email-highlight {
            font-weight: bold;
            color: rgb(16, 137, 211);
          }
          
          .form {
            margin-top: 20px;
          }
          
          .input {
            width: 100%;
            background: white;
            border: none;
            padding: 15px 20px;
            border-radius: 20px;
            margin-top: 15px;
            box-shadow: #cff0ff 0px 10px 10px -5px;
            border-inline: 2px solid transparent;
            direction: rtl;
          }
          
          .input::-moz-placeholder {
            color: rgb(170, 170, 170);
          }
          
          .input::placeholder {
            color: rgb(170, 170, 170);
          }
          
          .input:focus {
            outline: none;
            border-inline: 2px solid #12B1D1;
          }
          
          .button {
            display: block;
            width: 100%;
            font-weight: bold;
            background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
            color: white;
            padding: 15px;
            margin: 20px auto 10px;
            border-radius: 20px;
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
            border: none;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
          }
          
          .button:hover {
            transform: scale(1.03);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
          }
          
          .button:active {
            transform: scale(0.95);
            box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
          }
          
          .button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
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
          
          .success-message {
            background-color: #ebffeb;
            border-right: 4px solid #33ff33;
            color: #009900;
            padding: 10px;
            border-radius: 10px;
            margin-top: 15px;
            font-size: 12px;
            text-align: right;
            direction: rtl;
          }
          `}
        </style>
      </Helmet>

      <div className="recovery-page">
        <h1 className="page-title">استعادة كلمة المرور</h1>
        
        <div className="container">
          <h1 className="heading">استعادة كلمة المرور</h1>
          
          {!resetLinkSent ? (
            <>
              <p className="description">
                أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور
              </p>
              
              <div className="form">
                <input
                  type="email"
                  className="input"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                {showError && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
                
                <button
                  className="button"
                  onClick={handleRequestReset}
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="description">
                تم إرسال رابط إعادة التعيين إلى<br />
                <span className="email-highlight">{email}</span><br />
                يرجى التحقق من بريدك الإلكتروني والنقر على الرابط لإتمام عملية إعادة تعيين كلمة المرور
              </p>
              
              <div className="success-message">
                سيتم توجيهك إلى صفحة تسجيل الدخول خلال لحظات...
              </div>
              
              <button
                className="button"
                onClick={() => navigate('/login')}
              >
                العودة إلى تسجيل الدخول
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}