// src/pages/Registration/RegistrationContainer.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, saveUserToBackend, getArabicErrorMessage,sendVerificationEmail } from "../../auth/auth.services";
import RegistrationForm from "./RegistrationForm";
import { showSuccessAlert, showErrorAlert } from "./utils/alertUtils";
import "./styles/registrationStyles.js";
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../auth/firebase.config';
export default function RegistrationContainer({ onPageChange }) {
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    gender: "ذكر",
    birthdate: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    phone: "",
    email: ""
  });
  
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    phone: "",
    email: "",
    userRole: ""
  });

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleContinue = async (validFormData, validatedRole) => {
    try {
      if (!validFormData.email || !validFormData.email.includes('@')) {
        showErrorAlert('البريد الإلكتروني غير صالح');
        return;
      }
  
      setIsSubmitting(true);
      setFormSubmitted(true);
  
      const { user, error } = await registerWithEmail(
        validFormData.email,
        validFormData.password,
        `${validFormData.firstName} ${validFormData.lastName}`
      );
  
      if (error) {
        throw new Error(getArabicErrorMessage(error.code) || error.message || 'فشل تسجيل المستخدم');
      }
  
      localStorage.setItem('userRole', validatedRole.name);
      localStorage.setItem('userRolePath', validatedRole.path);
  
      await saveUserToBackend({
        ...validFormData,
        role: validatedRole.name,
        roleName: validatedRole.name,
      });
  
      await sendVerificationEmail(user);
  
      showSuccessAlert("تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى بريدك الإلكتروني");
  
      if (onPageChange) {
        onPageChange("otp", {
          email: validFormData.email,
          roleId: validatedRole.id,
          roleName: validatedRole.name
        });
      } else {
        navigate('/verify-email-reminder', {
          state: {
            email: validFormData.email,
            roleId: validatedRole.id,
            roleName: validatedRole.name
          }
        });
      }
  
    } catch (error) {
      console.error("خطأ في عملية التسجيل:", error);
      showErrorAlert(error.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setIsSubmitting(false);
    }
  };
  // معالجة إرسال النموذج
  /*const handleContinue = async (validFormData, validatedRole) => {
    try {
      // التحقق الأساسي من البريد الإلكتروني
      if (!validFormData.email || !validFormData.email.includes('@')) {
        showErrorAlert('البريد الإلكتروني غير صالح');
        return;
      }

      setIsSubmitting(true);
      setFormSubmitted(true);
  
      // تسجيل المستخدم في Firebase Authentication
      const { user, error } = await registerWithEmail(
        validFormData.email, 
        validFormData.password, 
        `${validFormData.firstName} ${validFormData.lastName}`
      );
      
      if (error) {
        throw new Error(getArabicErrorMessage(error.code) || error.message || 'فشل تسجيل المستخدم');
      }
      
      // حفظ البيانات الإضافية في Firestore
      await saveUserToBackend({
        firstName: validFormData.firstName,
        lastName: validFormData.lastName,
        email: validFormData.email,
        password: validFormData.password,
        phone: validFormData.phone,
        gender: validFormData.gender,
        age: validFormData.birthYear,
        requestedrole: validatedRole?.name || "",
        role_name: validatedRole?.name || "",     // ✅ هذا ضروري للباك
        role: validatedRole?.name?.toLowerCase() || "innovator" // ✅ هذا الذي يستخدم في endpoint
      });
      
      
      
      
      
    // احفظ معلومات الدور في sessionStorage و localStorage
    try {
     sessionStorage.setItem('userRole', validatedRole.name);
    sessionStorage.setItem('userRolePath', validatedRole.path || '/dashboard');
  
     localStorage.setItem('userRole', validatedRole.name);
      localStorage.setItem('userRolePath', validatedRole.path || '/dashboard');
     }    catch (storageError) {
      console.warn("فشل في حفظ بيانات الدور:", storageError);
      }
      // إرسال بريد التحقق باستخدام Firebase
      await sendVerificationEmail(user);
      
     
      // عرض رسالة نجاح
      showSuccessAlert("تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى بريدك الإلكتروني");
      if (onPageChange) {
        onPageChange("otp", {
          email: validFormData.email,
          roleId: validatedRole.id
        });
      }
      
      // الانتقال إلى صفحة انتظار التحقق
      setTimeout(() => {
        navigate('/verify-email-reminder', { 
          state: { 
            email: validFormData.email,
            roleId: validatedRole.id 
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error("خطأ في عملية التسجيل:", error);
      showErrorAlert(error.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setIsSubmitting(false);
    }
  };*/
  
  return (
    <div className="bg-[#f1f5f9] min-h-screen flex justify-center items-center py-8 relative">
      <div className="max-w-md mx-auto">
        <RegistrationForm 
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          isSubmitting={isSubmitting}
          formSubmitted={formSubmitted}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          onContinue={handleContinue}
          onLoginClick={handleLoginClick}
        />
      </div>
    </div>
  );
}
