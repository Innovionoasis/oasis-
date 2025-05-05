// أنماط التسجيل - بالتصميم المطلوب
const styles = `
.reg-container {
  max-width: 950px;
  background: #F8F9FD;
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
  margin: 20px;
  direction: rtl;
  text-align: right;
}

.reg-title {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
}

.reg-form {
  margin-top: 20px;
}

.reg-form .reg-input {
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
  direction: rtl;
  text-align: right;
}

.reg-form .reg-input::-moz-placeholder {
  color: rgb(170, 170, 170);
  text-align: right;
}

.reg-form .reg-input::placeholder {
  color: rgb(170, 170, 170);
  text-align: right;
}

.reg-form .reg-input:focus {
  outline: none;
  border-inline: 2px solid #12B1D1;
}
.reg-form .flex.gap-4 {
  display: flex;
  flex-direction: row-reverse; /* عكس اتجاه الصف */
  gap: 15px;
}
  .reg-form .flex.gap-4 > div {
  flex: 1; /* توزيع متساوٍ للعرض */
}
.reg-form .reg-submit-btn {
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

.reg-form .reg-submit-btn:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.reg-form .reg-submit-btn:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}

.reg-date-container {
  margin-top: 15px;
  width: 100%;
}

.reg-date-label {
 color: rgb(16, 137, 211);
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.reg-date-inputs {
  background: white;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
  direction: rtl;
}

.reg-date-inputs:focus-within {
  border-inline: 2px solid #12B1D1;
}

.reg-date-select {
  background: transparent;
  border: none;
  text-align: center;
  width: 100%;
  outline: none;
  direction: rtl;
  font-size: 16px;
}

.reg-dropdown-toggle {
 width: 100%;
 margin-top: 15px;
  text-align: right;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 20px;
  background: white;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
  font-size: 16px;
  direction: rtl;
  
}

.reg-dropdown-toggle:focus {
  outline: none;
  border-inline: 2px solid #12B1D1;
}

.reg-dropdown-menu {
 width: 100%;
 max-height: 200px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
   overflow-y: auto;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  margin-top: 5px;
  z-index: 100;
  direction: rtl;
}

.reg-dropdown-item {
  padding: 12px 20px;
  cursor: pointer;
  text-align: right;
  transition: all 0.2s;
  direction: rtl;
}

.reg-dropdown-item:hover {
  background: rgba(18, 177, 209, 0.1);
}

.reg-role-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.reg-role-name {
  font-weight: 500;
  color: #333;
}

.reg-role-description {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}

.reg-gender-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
  gap: 20px;
   direction: rtl;
}

.reg-gender-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reg-gender-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #12B1D1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.reg-gender-radio.selected {
  background-color: #12B1D1;
  box-shadow: 0 0 0 2px white inset;
}

.reg-gender-radio:hover {
  transform: scale(1.1);
}

.reg-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  gap: 5px;
  font-size: 14px;
}

.reg-login-text {
  color: #666;
}

.reg-login-link {
  color: #0099ff;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;
}

.reg-login-link:hover {
  text-decoration: underline;
}

.reg-error-message {
  color: #ef4444;
  font-size: 12px;
  text-align: right;
  margin-top: 5px;
  padding: 8px;
  background-color: rgba(254, 226, 226, 0.8);
  border-right: 4px solid #ef4444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 40px; /* تحديد ارتفاع ثابت */
  min-height: 40px; /* تأكيد الحد الأدنى للارتفاع */
  max-height: 40px; /* تأكيد الحد الأقصى للارتفاع */
  overflow: hidden;
  box-sizing: border-box;
  margin-bottom: 10px; /* إضافة مسافة أسفل الإشعار */
}

.reg-error-message svg {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  flex-shrink: 0;
}

.reg-input-error {
  border: 1px solid #ef4444;
  border-inline: 1px solid #ef4444;
}
    
    .verification-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    padding: 20px;
  }

  .verification-card {
    max-width: 550px;
    width: 100%;
    background: #F8F9FD;
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.878) 0px 30px 30px -20px;
    margin: 20px auto;
    text-align: center;
  }

  .verification-title {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
    margin-bottom: 20px;
  }

  .verification-message {
    color: #333;
    margin-bottom: 25px;
    direction: rtl;
    text-align: right;
  }

  .verification-email {
    font-weight: 600;
    color: rgb(16, 137, 211);
    display: inline-block;
    margin: 10px 0;
  }

  .verification-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .verification-check-btn,
  .verification-resend-btn {
    display: block;
    width: 100%;
    font-weight: bold;
    color: white;
    padding-block: 15px;
    margin: 10px auto;
    border-radius: 20px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    font-size: 16px;
  }

  .verification-check-btn {
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
  }

  .verification-resend-btn {
    background: white;
    color: rgb(16, 137, 211);
    border: 2px solid rgb(16, 137, 211);
    box-shadow: #cff0ff 0px 10px 10px -5px;
  }

  .verification-check-btn:hover,
  .verification-resend-btn:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
  }

  .verification-check-btn:active,
  .verification-resend-btn:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
  }

  .verification-check-btn:disabled,
  .verification-resend-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: scale(1);
    box-shadow: none;
  }

  .verification-spam-note {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
    direction: rtl;
    text-align: right;
  }
`;

// إنشاء عنصر <style> وإضافته للصفحة
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default styles;