// src/pages/ActionHandler/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../auth/firebase.config';
import { verifyPasswordResetCode, applyActionCode } from "firebase/auth";
import "./ActionHandler.css";
import { getPathByRole, FIXED_ROLES, arabicToEnglish } from '../../auth/auth.services';

const ActionHandler = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("جاري التحقق...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAction = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get("mode");
        const oobCode = urlParams.get("oobCode");
        
        console.log("نوع العملية:", mode);
        console.log("رمز العملية:", oobCode);
        
        if (mode === "resetPassword" && oobCode) {
          try {
            const email = await verifyPasswordResetCode(auth, oobCode);
            console.log("البريد الإلكتروني المرتبط بالرمز:", email);
            
            navigate(`/reset-password?oobCode=${oobCode}`);
            return;
          } catch (error) {
            console.error("خطأ في التحقق من رمز إعادة تعيين كلمة المرور:", error);
            setStatus("error");
            setMessage("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.");
            
            setTimeout(() => {
              navigate("/recoverpassword");
            }, 2000);
            setLoading(false);
            return;
          }
        }
        
if (mode === "verifyEmail" && oobCode) {
  try {
    await applyActionCode(auth, oobCode);
    console.log("تم تأكيد البريد الإلكتروني بنجاح");
    
    setStatus("success");
    setMessage("تم تأكيد بريدك الإلكتروني بنجاح!");
    
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      await currentUser.reload();
      
      const savedRole = localStorage.getItem('userRole');
      
      if (savedRole) {
        console.log(`استخدام الدور المحفوظ: ${savedRole}`);
        setTimeout(() => navigateByRole(savedRole), 1500);
        return;
      }
      
      try {
        const tables = ['innovator', 'mentor', 'reviewer', 'investor', 'admin'];
        
        for (const table of tables) {
          try {
            const response = await fetch(`http://localhost:4000/api/${table}?email=${currentUser.email}`);
            if (response.ok) {
              const users = await response.json();
              if (users && users.length > 0) {
                console.log(`تم العثور على المستخدم في جدول ${table}`);
                
                localStorage.setItem('userRole', table);
                
                setTimeout(() => navigateByRole(table), 1500);
                return;
              }
            }
          } catch (tableError) {
            console.warn(`فشل البحث في جدول ${table}:`, tableError);
          }
        }
        
        const foundInFirestore = await checkFirestoreForUser(currentUser);
        if (foundInFirestore) return;
        localStorage.setItem('userRole', 'innovator');
        setTimeout(() => navigate('/innovator', { replace: true }), 1500);
      } catch (error) {
        console.error("خطأ في البحث عن المستخدم:", error);
        localStorage.setItem('userRole', 'innovator');
        setTimeout(() => navigate('/innovator', { replace: true }), 1500);
      }
    } else {
      setTimeout(() => navigate("/login"), 1500);
    }
  } catch (error) {
    console.error("خطأ في تأكيد البريد الإلكتروني:", error);
    setStatus("error");
    setMessage("فشل في تأكيد البريد الإلكتروني. قد يكون الرابط منتهي الصلاحية أو تم استخدامه بالفعل.");
    
    setTimeout(() => navigate("/login"), 2000);
    setLoading(false);
  }
} else {
          redirectUserByRole();
        }
      } catch (error) {
        console.error("خطأ عام في معالجة العملية:", error);
        setStatus("error");
        setMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setLoading(false);
      }
    };
    
    const checkFirestoreForUser = async (user) => {
      try {
        const collections = ["users", "innovator", "mentor", "reviewer","investor"];
        
        for (const collectionName of collections) {
          try {
            const docRef = doc(db, collectionName, user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const userData = docSnap.data();
              console.log(`تم العثور على المستخدم في مجموعة ${collectionName}:`, userData);
              
              let roleName = userData.role_name || userData.currentroles || "Innovator";
              localStorage.setItem('userRole', roleName);
              
              setStatus("success");
              setMessage(`تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم (${roleName})...`);
              
              setTimeout(() => {
                navigateByRole(roleName);
              }, 1500);
              return true;
            }
          } catch (error) {
            console.log(`خطأ في البحث في مجموعة ${collectionName}:`, error);
          }
        }
        
        localStorage.setItem('userRole', 'Innovator');
        
        setStatus("success");
        setMessage("تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم كمبتكر...");
        
        setTimeout(() => {
          navigate("/innovator");
        }, 1500);
        
        return false;
      } catch (error) {
        console.error("خطأ في البحث عن المستخدم في Firestore:", error);
        localStorage.setItem('userRole', 'Innovator');
        
        setStatus("success");
        setMessage("تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم كمبتكر...");
        
        setTimeout(() => {
          navigate("/innovator");
        }, 1500);
        
        return false;
      }
    };
    
const navigateByRole = (role) => {
  try {
    const roleMap = {
      'innovator': '/innovator',
      'مبتكر': '/innovator',
      'reviewer': '/rev',
      'محكم': '/rev',
      'mentor': '/mentor',
      'مشرف': '/mentor',
      'investor': '/page1',
      'مستثمر': '/page1',
      'admin': '/page',
      'الادمن': '/page'
    };

    const roleString = String(role || '').toLowerCase();
    
    const targetPath = roleMap[roleString];
    
    if (targetPath) {
      console.log(`توجيه المستخدم إلى: ${targetPath} بناءً على الدور: ${role}`);
      navigate(targetPath, { replace: true });
      return;
    }
    
    if (typeof getPathByRole === 'function') {
      const servicePath = getPathByRole(role);
      console.log(`توجيه المستخدم باستخدام getPathByRole إلى: ${servicePath}`);
      navigate(servicePath, { replace: true });
      return;
    }
    
    console.log(`لم يتم العثور على مسار للدور: ${role}، استخدام المسار الافتراضي /innovator`);
    navigate('/innovator', { replace: true });
  } catch (error) {
    console.error('خطأ في التوجيه حسب الدور:', error);
    navigate('/innovator', { replace: true });
  }
};
    
    const redirectUserByRole = async () => {
      try {
        const currentUser = auth.currentUser;
    
        if (currentUser) {
          const savedRole = localStorage.getItem('userRole');
          
          if (savedRole) {
            console.log(`استخدام الدور المحفوظ: ${savedRole}`);
            setStatus("success");
            setMessage("تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم...");
            setTimeout(() => navigateByRole(savedRole), 1500);
            return;
          }
          
          try {
            const tables = ['innovator', 'mentor', 'reviewer', 'investor', 'admin'];
            
            for (const table of tables) {
              try {
                const response = await fetch(`http://localhost:4000/api/${table}?email=${currentUser.email}`);
                if (response.ok) {
                  const users = await response.json();
                  if (users && users.length > 0) {
                    localStorage.setItem('userRole', table);
                    setStatus("success");
                    setMessage(`تم التحقق بنجاح! جاري توجيهك كـ ${table}...`);
                    setTimeout(() => navigateByRole(table), 1500);
                    return;
                  }
                }
              } catch (tableError) {
                console.warn(`فشل البحث في جدول ${table}:`, tableError);
              }
            }
            
            await checkFirestoreForUser(currentUser);
          } catch (error) {
            console.error("خطأ في البحث عن المستخدم:", error);
            localStorage.setItem('userRole', 'innovator');
            setStatus("success");
            setMessage("تم التحقق بنجاح! جاري توجيهك كمبتكر...");
            setTimeout(() => navigate('/innovator', { replace: true }), 1500);
          }
        } else {
          const savedRole = localStorage.getItem('userRole');
          
          if (savedRole) {
            setStatus("success");
            setMessage("تم التحقق بنجاح! جاري توجيهك...");
            setTimeout(() => navigateByRole(savedRole), 1500);
          } else {
            setStatus("error");
            setMessage("يرجى تسجيل الدخول أولاً للوصول إلى لوحة التحكم.");
            setTimeout(() => navigate("/login"), 2000);
          }
        }
      } catch (error) {
        console.error("خطأ في توجيه المستخدم:", error);
        setStatus("error");
        setMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAction();
  }, [navigate]);

  const handleButtonClick = () => {
    if (status === "success") {
      const savedRole = localStorage.getItem('userRole');
      
      const normalizedRole = String(savedRole || "").toLowerCase();
      
      switch (normalizedRole) {
        case 'innovator':
        case 'مبتكر':
          navigate("/innovator");
          break;
        case 'mentor':
        case 'مشرف':
          navigate("/mentor");
          break;
        case 'reviewer':
        case 'محكم':
          navigate("/rev");
          break;
          case 'investor':
            case 'مستثمر':
              navigate("/page1");
              break;
        default:
          navigate("/innovator");
          break;
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="action-handler-wrapper">
      <div className="container">
        <h1 className="heading">
          {status === "loading" && "جاري المعالجة..."}
          {status === "success" && "تم التحقق بنجاح!"}
          {status === "error" && "حدث خطأ!"}
        </h1>
        
        <div className="form">
          <div className={`status-icon ${status}`}>
            {status === "loading" && <div className="loader"></div>}
            {status === "success" && <span className="checkmark">✓</span>}
            {status === "error" && <span className="error-mark">✗</span>}
          </div>
          
          <p className="status-message">{message}</p>
          
          {!loading && (
            <button className="login-button" onClick={handleButtonClick}>
              {status === "success" ? "الانتقال إلى لوحة التحكم" : "العودة إلى تسجيل الدخول"}
            </button>
          )}
        </div>
        
        <div className="agreement">
          <a href="/">منصة الابتكار © {new Date().getFullYear()} • جميع الحقوق محفوظة</a>
        </div>
      </div>
    </div>
  );
};

export default ActionHandler;
