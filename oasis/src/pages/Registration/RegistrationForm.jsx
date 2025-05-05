import React, { useState, useEffect } from "react";
import * as authServices from '../../auth/auth.services';
import { validateForm } from "./utils/validationUtils";
import { showErrorAlert, showSuccessAlert } from "./utils/alertUtils";

import UserInfoInputs from "./components/UserInfoInputs";
import PasswordInputs from "./components/PasswordInputs";
import BirthdateInputs from "./components/BirthdateInputs";
import RoleSelector from "./components/RoleSelector";
import GenderSelector from "./components/GenderSelector";

export default function RegistrationForm({
  formData,
  setFormData,
  errors,
  setErrors,
  isSubmitting,
  formSubmitted,
  selectedRole,
  setSelectedRole,
  onContinue,
  onLoginClick
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [availableRoles, setAvailableRoles] = useState([]);
  
  useEffect(() => {
    setAvailableRoles(authServices.FIXED_ROLES || []);
  }, []);

  useEffect(() => {
    if (formData && formData.birthYear && formData.birthMonth && formData.birthDay) {
      setFormData(prev => ({
        ...prev,
        birthdate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`
      }));
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay, setFormData]);

  const clearErrorForField = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
    
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.classList.remove('reg-input-error');
    }
    
    const errorElement = document.querySelector(`[name="${fieldName}"]`)?.parentElement?.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    clearErrorForField(name);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
    
    clearErrorForField('userRole');
  };

  const handleGenderChange = (gender) => {
    setFormData({
      ...formData,
      gender
    });
  };
  
  const handleContinue = (e) => {
    if (e) e.preventDefault();
    
    const allErrors = document.querySelectorAll('.reg-error-message');
    allErrors.forEach(err => err.remove());
    
    const inputsWithError = document.querySelectorAll('.reg-input-error');
    inputsWithError.forEach(input => input.classList.remove('reg-input-error'));
    
    const validation = validateForm(formData, selectedRole);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      console.log("النموذج صالح، جاري إرسال البيانات...");
      onContinue(formData, selectedRole);
    } else {
      console.log("النموذج غير صالح، عرض رسائل الخطأ");
      Object.entries(validation.errors).forEach(([field, message]) => {
        if (message) {
          showErrorAlert(message, field);
        }
      });
    }
  };
  
  return (
    <div className="reg-container" style={{ direction: 'rtl', textAlign: 'right' }}>
      <h1 className="reg-title">التسجيل</h1>
      
      <div className="reg-form">
        <UserInfoInputs 
          formData={formData}
          errors={errors}
          formSubmitted={formSubmitted}
          onChange={handleInputChange}
        />
        
        <PasswordInputs 
          formData={formData}
          errors={errors}
          formSubmitted={formSubmitted}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          onChange={handleInputChange}
        />
        
        <BirthdateInputs 
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          formSubmitted={formSubmitted}
        />
  
        <RoleSelector 
          selectedRole={selectedRole}
          availableRoles={availableRoles}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onSelect={handleRoleSelect}
          error={errors.userRole}
          formSubmitted={formSubmitted}
        />
        
        <GenderSelector 
          gender={formData.gender}
          onChange={handleGenderChange}
        />
        
        <button
          type="button"
          className="reg-submit-btn"
          onClick={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الإرسال..." : "متابعة"}
        </button>
        
        <div className="reg-login-container">
          <span className="reg-login-text">
            هل لديك حساب بالفعل؟
          </span>
          <a 
            href="/login"
            className="reg-login-link"
            onClick={(e) => {
              e.preventDefault();
              onLoginClick();
            }}
          >
            تسجيل دخول
          </a>
        </div>
      </div>
    </div>
  )
}
