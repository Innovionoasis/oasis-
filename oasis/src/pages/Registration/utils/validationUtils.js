export const validatePassword = (password) => {
  const uppercaseRegex = /^[A-Z]/;
  const numberRegex = /[0-9]/;
  const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  
  if (!password) {
    return "كلمة المرور مطلوبة";
  }
  
  if (!uppercaseRegex.test(password)) {
    return "يجب أن تبدأ كلمة المرور بحرف كبير";
  }
  
  if (!numberRegex.test(password)) {
    return "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
  }
  
  if (!symbolRegex.test(password)) {
    return "يجب أن تحتوي كلمة المرور على رمز واحد على الأقل";
  }
  
  if (password.length < 8) {
    return "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل";
  }
  
  return "";
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "تأكيد كلمة المرور مطلوب";
  }
  
  if (password !== confirmPassword) {
    return "كلمة المرور وتأكيدها غير متطابقين";
  }
  
  return "";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return "البريد الإلكتروني مطلوب";
  }
  
  if (!emailRegex.test(email)) {
    return "الرجاء إدخال بريد إلكتروني صحيح";
  }
  
  const usedEmails = ['test@example.com', 'user@example.com', 'admin@example.com'];
  if (usedEmails.includes(email.toLowerCase())) {
    return "البريد الإلكتروني مستخدم بالفعل";
  }
  
  return "";
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  
  if (!phone) {
    return "رقم الهاتف مطلوب";
  }
  
  if (!phoneRegex.test(phone)) {
    return "الرجاء إدخال رقم هاتف صحيح (10 أرقام)";
  }
  
  return "";
};

export const validateDate = (dateString) => {
  if (!dateString) {
    return "تاريخ الميلاد مطلوب";
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return "يرجى تحديد تاريخ صحيح";
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return "تاريخ غير صالح";
  }
  
  if (date > now) {
    return "لا يمكن اختيار تاريخ في المستقبل";
  }
  
  const birthYear = date.getFullYear();
  const birthMonth = date.getMonth();
  const birthDay = date.getDate();
  
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  
  let age = todayYear - birthYear;
  
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
    age--;
  }
  
  if (age < 18) {
    return "يجب أن يكون عمرك 18 سنة على الأقل للتسجيل";
  }
  
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value) {
    return `${fieldName} مطلوب`;
  }
  
  return "";
};

export const checkPasswordMatch = (formData) => {
  const { password, confirmPassword } = formData;
  if (password && confirmPassword && password !== confirmPassword) {
    return false;
  }
  return true;
};

export const validateAge = (birthYear, birthMonth, birthDay) => {
  if (!birthYear || !birthMonth || !birthDay) {
    return "تاريخ الميلاد مطلوب بالكامل";
  }
  
  const year = parseInt(birthYear, 10);
  const month = parseInt(birthMonth, 10) - 1; 
  const day = parseInt(birthDay, 10);
  
  const birthDate = new Date(year, month, day);
  const today = new Date();
  
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day ||
    birthDate > today
  ) {
    return "تاريخ غير صالح";
  }
  
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month ||
    (today.getMonth() === month && today.getDate() < day)
  ) {
    age--;
  }
  
  if (age < 18) {
    return "يجب أن يكون عمرك 18 سنة على الأقل للتسجيل";
  }
  
  return "";
};

export const validateForm = (formData, selectedRole) => {
  let birthdateError = "";
  if (formData.birthYear && formData.birthMonth && formData.birthDay) {
    birthdateError = validateAge(formData.birthYear, formData.birthMonth, formData.birthDay);
  } else {
    birthdateError = validateDate(formData.birthdate);
  }
  
  const errors = {
    firstName: validateRequired(formData.firstName, "الاسم الأول"),
    lastName: validateRequired(formData.lastName, "الاسم الأخير"),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword),
    birthdate: birthdateError,
    phone: validatePhone(formData.phone),
    email: validateEmail(formData.email),
    userRole: validateRequired(selectedRole, "دور المستخدم")
  };
  
  const hasErrors = Object.values(errors).some(error => error !== "");
  
  return {
    errors,
    isValid: !hasErrors
  };
};