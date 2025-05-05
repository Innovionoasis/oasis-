// src/utils/roleUtils.js

/**
 * الحصول على مسار صفحة الدور
 * @param {string} roleName - اسم الدور
 * @returns {string} - مسار الصفحة
 */
export const getPathForRole = (roleName) => {
    if (!roleName) return '/dashboard';
    
    switch (roleName) {
      case 'مبتكر': return '/innovator';
      case 'محكم': return '/rev';
      case 'مشرف': return '/mentor';
      case 'مستثمر': return '/page1';
      default: return '/dashboard';
    }
  };
  
  /**
   * توجيه المستخدم بناءً على دوره
   * @param {Object} userData - بيانات المستخدم 
   * @param {Function} navigate - دالة التوجيه
   * @param {string} defaultPath - المسار الافتراضي
   */
  export const redirectUserByRole = (userData, navigate, defaultPath = '/dashboard') => {
    if (!userData) {
      navigate(defaultPath);
      return;
    }
    
    const roleName = userData.role_name || userData.roleName;
    
    let targetPath = defaultPath;
    if (roleName) {
      targetPath = getPathForRole(roleName);
    }
    
    localStorage.setItem('userRole', roleName || '');
    localStorage.setItem('userRolePath', targetPath);
    navigate(targetPath);
  };
  
  export const hasPermission = (userRoleId, userRoleName, allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    
    return allowedRoles.includes(userRoleId) || allowedRoles.includes(userRoleName);
  };
  
  export const ROLES = {
    INNOVATOR: { id: '1', name: 'مبتكر', path: '/innovator' },
    REVIEWER: { id: '2', name: 'محكم', path: '/rev' },
    MENTOR: { id: '3', name: 'مشرف', path: '/mentor' },
    MENTOR: { id: '4', name: 'مستثمر', path: '/investor' },

  };