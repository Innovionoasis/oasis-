import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase.config";
import { sendEmailVerification } from "firebase/auth";
export const FIXED_ROLES = [
  { id: '1', name: 'مبتكر', path: '/innovator', description: 'يمكنك تقديم أفكارك الإبداعية وعرضها على المستثمرين' },
  { id: '2', name: 'محكم', path: '/rev', description: 'مراجعة وتقييم الأفكار المقدمة من المبتكرين' },
  { id: '3', name: 'مشرف', path: '/mentor', description: 'تقديم الإرشاد والدعم للمبتكرين لتطوير أفكارهم' },
  { id: '4', name: 'مستثمر', path: '/page1', description: 'الاستثمار في الأفكار الواعدة وتمويلها' },
  { id: '5', name: 'الادمن', path: '/page', description: 'المسئوليين عن ادارة المنصة ' }

];


export const sendVerificationEmail = async (user) => {
  try {
    const continueUrl = `${window.location.origin}/__/auth/action`;    
    await sendEmailVerification(user, {
      url: continueUrl,
      handleCodeInApp: true 
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const resetPassword = async (email) => {
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    };
    
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("تم إرسال رابط استعادة كلمة المرور إلى:", email);
    return { success: true };
  } catch (error) {
    console.error("خطأ في إرسال بريد استعادة كلمة المرور:", error);
    return { success: false, error };
  }
};

export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: displayName
    });


    return { user, error: null };
  } catch (error) {
    console.error("خطأ في تسجيل المستخدم:", error);
    return { user: null, error };
  }
};
export const saveUserToBackend = async (formData) => {
  try {
    let role = formData.role || formData.roleName || "innovator";
    
    const roleMapping = {
      'مبتكر': 'innovator',
      'محكم': 'reviewer',
      'مشرف': 'mentor',
      'مستثمر': 'investor',
      'الادمن': 'admin'
    };
    
    if (roleMapping[role]) {
      role = roleMapping[role];
    }
    
    const normalizedRole = role.toLowerCase();
    
    const endpoint = `http://localhost:4000/api/${normalizedRole}`;
    
    const payload = {
      f_name: formData.firstName || formData.f_name,
      l_name: formData.lastName || formData.l_name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      requestedrole: role,
      gender: formData.gender,
      age: formData.birthYear || formData.age
    };
    
    console.log(`إرسال البيانات إلى: ${endpoint}`, payload);
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "فشل في حفظ بيانات المستخدم");
    }
    
    const result = await response.json();
    
    localStorage.setItem('userRole', normalizedRole);
    
    return result;
  } catch (error) {
    console.error("خطأ في حفظ بيانات المستخدم:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("تم تسجيل الدخول في Firebase بنجاح:", user.email);
    
    try {
      const tables = ['innovator', 'mentor', 'reviewer', 'investor', 'admin'];
      
      let foundRole = null;
      
      for (const table of tables) {
        try {
          console.log(`البحث في جدول ${table}...`);
          const response = await fetch(`http://localhost:4000/api/${table}`);
          
          if (response.ok) {
            const allUsers = await response.json();
            console.log(`عدد السجلات في جدول ${table}:`, allUsers?.length || 0);
            
            const foundUser = allUsers?.find(u => 
              u.email?.toLowerCase() === email.toLowerCase()
            );
            
            if (foundUser) {
              console.log(`تم العثور على المستخدم في جدول ${table}:`, foundUser);
              foundRole = table;
              break;
            }
          } else {
            console.warn(`فشل في جلب جدول ${table}:`, response.status);
          }
        } catch (tableError) {
          console.warn(`خطأ في البحث في جدول ${table}:`, tableError);
        }
      }
      
      if (foundRole) {
        console.log("تم تحديد دور المستخدم:", foundRole);
        localStorage.setItem('userRole', foundRole);
        return { user, role: foundRole, error: null };
      } else {
        console.log("لم يتم العثور على المستخدم في أي جدول. استخدام دور افتراضي: innovator");
        localStorage.setItem('userRole', 'innovator');
        return { user, role: 'innovator', error: null };
      }
    } catch (roleError) {
      console.error("خطأ في البحث عن دور المستخدم:", roleError);
      localStorage.setItem('userRole', 'innovator');
      return { user, role: 'innovator', error: null };
    }
  } catch (authError) {
    console.error("خطأ في تسجيل الدخول مع Firebase:", authError);
    return { user: null, role: null, error: authError };
  }
};

export const getUserRoleAndPath = async (user) => {
  if (!user || !user.uid) {
    return { role: "Innovator", path: "/innovator" };
  }

  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    console.log("استخدام الدور المخزن في localStorage:", storedRole);
    return { role: storedRole, path: getPathByRole(storedRole) };
  }
  
  let userRole = null;
  
  if (user.email) {
    try {
      for (const roleTable of ['innovator', 'mentor', 'reviewer', 'investor', 'admin']) {
        try {
          const response = await fetch(`http://localhost:4000/api/${roleTable}?email=${user.email}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              userRole = roleTable;
              console.log(`تم العثور على المستخدم في جدول ${roleTable}`);
              localStorage.setItem('userRole', userRole);
              break;
            }
          }
        } catch (tableError) {
          console.warn(`فشل في البحث في جدول ${roleTable}:`, tableError);
        }
      }
    } catch (dbError) {
      console.error("خطأ في البحث عن المستخدم في قاعدة البيانات:", dbError);
    }
  }
  
  if (!userRole) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole = userData.role || userData.role_name || userData.role_id;
        if (userRole) {
          localStorage.setItem('userRole', userRole);
        }
      }
    } catch (firestoreError) {
      console.error("خطأ في جلب الدور من Firestore:", firestoreError);
    }
  }
  
  if (!userRole) {
    userRole = "innovator";
    localStorage.setItem('userRole', userRole);
  }
  
  const path = getPathByRole(userRole);
  return { role: userRole, path };
};
 
export const getTargetPathByUserType = (userType) => {
  switch(userType) {
    case "مبتكر":
      return "/innovator";
    case "مشرف":
      return "/mentor"; 
    case "محكم":
      return "/rev";
    case "مستثمر":
      return "/page1";
      case "الادمن":
        return "/page";
    default:
      return "/dashboard";
  }
};

export const arabicToEnglish = {
  'مبتكر': 'Innovator',
  'مشرف': 'Mentor',
  'محكم': 'Reviewer',
  'مستثمر': 'Investor',
  'الادمن': 'Admin'

};

export const getPathByRole = (roleInput) => {
  console.log("getPathByRole - الدور المدخل:", roleInput, "نوعه:", typeof roleInput);
  
  const stringRoleInput = String(roleInput || "").toLowerCase();
  console.log("stringRoleInput بعد التحويل:", stringRoleInput);
  
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
  
  console.log("البحث في roleMap عن:", stringRoleInput);
  
  if (roleMap[stringRoleInput]) {
    console.log("تم العثور على مطابقة مباشرة في roleMap:", roleMap[stringRoleInput]);
    return roleMap[stringRoleInput];
  }
  
  console.log("البحث في FIXED_ROLES...");
  const foundRole = FIXED_ROLES.find(role => 
    role.id === stringRoleInput || 
    role.name.toLowerCase() === stringRoleInput ||
    (role.name.toLowerCase() === arabicToEnglish[stringRoleInput]?.toLowerCase())
  );
  
  if (foundRole) {
    console.log("تم العثور على مطابقة في FIXED_ROLES:", foundRole.path);
    return foundRole.path;
  }
  
  console.log("لم يتم العثور على مطابقة، إرجاع المسار الافتراضي: /innovator");
  return '/innovator';
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
    return { success: false, error };
  }
};

export const getUserRole = async (userId) => {
  try {
    if (!userId) {
      console.warn("محاولة جلب معلومات المستخدم بدون معرف");
      return null;
    }
    
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { 
        roleId: userData.role_id,
        roleName: userData.role_name,
        ...userData
      };
    } else {
      console.warn("لم يتم العثور على بيانات المستخدم");
      return null;
    }
  } catch (error) {
    console.error("خطأ في جلب معلومات المستخدم:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || '',
        email: user.email || '',
        role_id: '1', 
        role_name: 'مبتكر',
        created_at: serverTimestamp(),
        last_login: serverTimestamp(),
        created_via: 'google'
      });
    } else {
      await setDoc(doc(db, "users", user.uid), {
        last_login: serverTimestamp()
      }, { merge: true });
    }
    
    return { user, error: null };
  } catch (error) {
    console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
    return { user: null, error };
  }
};

export const loginWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || '',
        email: user.email || '',
        role_id: '1', 
        role_name: 'مبتكر',
        created_at: serverTimestamp(),
        last_login: serverTimestamp(),
        created_via: 'facebook'
      });
    } else {
      await setDoc(doc(db, "users", user.uid), {
        last_login: serverTimestamp()
      }, { merge: true });
    }
    
    return { user, error: null };
  } catch (error) {
    console.error("خطأ في تسجيل الدخول باستخدام Facebook:", error);
    return { user: null, error };
  }
};

export const getArabicErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/invalid-email': 'البريد الإلكتروني غير صالح',
    'auth/weak-password': 'كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف على الأقل',
    'auth/user-not-found': 'لم يتم العثور على مستخدم بهذا البريد الإلكتروني',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/too-many-requests': 'تم تقييد الوصول بسبب محاولات متكررة، يرجى المحاولة لاحقًا',
    'auth/user-disabled': 'تم تعطيل هذا الحساب',
    'auth/requires-recent-login': 'تحتاج إلى إعادة تسجيل الدخول لإكمال هذه العملية',
    'auth/popup-closed-by-user': 'تم إغلاق نافذة التسجيل قبل إكمال العملية',
    'auth/cancelled-popup-request': 'تم إلغاء طلب نافذة التسجيل',
    'auth/popup-blocked': 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع والمحاولة مرة أخرى',
    'auth/account-exists-with-different-credential': 'يوجد حساب بالفعل بهذا البريد الإلكتروني ولكن بطريقة تسجيل دخول مختلفة',
  };
  
  return errorMessages[errorCode] || 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
};
