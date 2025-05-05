const showGlobalAlert = (message, type) => {
  const existingAlerts = document.querySelectorAll('.global-alert');
  existingAlerts.forEach(alert => {
    if (alert.textContent.includes(message)) {
      alert.remove();
    }
  });
  
  const alertElement = document.createElement('div');
  alertElement.className = 'global-alert fixed top-4 left-4 right-4 z-50';
  alertElement.style.direction = 'rtl';
  
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  
  alertElement.innerHTML = `
    <div class="max-w-md mx-auto ${bgColor} ${textColor} border-r-4 ${borderColor} p-3 rounded-lg flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        ${type === 'success' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'}
      </svg>
      <span class="mr-2">${message}</span>
    </div>
  `;
  
  document.body.appendChild(alertElement);
  
  setTimeout(() => {
    alertElement.style.transition = 'opacity 0.5s, transform 0.5s';
    alertElement.style.opacity = '1';
    alertElement.style.transform = 'translateY(0)';
  }, 10);
  
  setTimeout(() => {
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (alertElement.parentNode) {
        document.body.removeChild(alertElement);
      }
    }, 500);
  }, 3000);
};

const showFieldAlert = (message, fieldName) => {
  let field = null;
  try {
    field = document.querySelector(`[name="${fieldName}"]`);
    
    if (!field) {
      if (fieldName === 'password') {
        field = document.querySelector('input[type="password"]');
      } else if (fieldName === 'confirmPassword') {
        field = document.querySelectorAll('input[type="password"]')[1];
      } else if (fieldName === 'email') {
        field = document.querySelector('input[type="email"]');
      } else if (fieldName === 'birthdate') {
        field = document.querySelector('.reg-date-inputs');
      } else if (fieldName === 'userRole') {
        field = document.querySelector('.reg-dropdown-toggle');
      }
    }
  } catch (e) {
    console.warn(`لم يتم العثور على حقل باسم ${fieldName}`);
    return showGlobalAlert(message, 'error');
  }
  
  if (!field) {
    return showGlobalAlert(message, 'error');
  }
  
  let container = field.parentElement;
  
  if (fieldName === 'userRole') {
    container = field.closest('.relative') || field.parentElement;
    
    const existingAlerts = container.querySelectorAll('.reg-error-message');
    existingAlerts.forEach(alert => alert.remove());
    
    field.classList.add('reg-input-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'reg-error-message';
    
    errorDiv.innerHTML = `
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none">
        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
      </svg>
      <span>${message}</span>
    `;
    
    container.appendChild(errorDiv);
    return;
  }
  
  const existingAlerts = container.querySelectorAll('.reg-error-message');
  existingAlerts.forEach(alert => alert.remove());
  
  field.classList.add('reg-input-error');
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'reg-error-message';
  
  errorDiv.innerHTML = `
    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none">
      <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
    </svg>
    <span>${message}</span>
  `;
  
  container.appendChild(errorDiv);
};

export const showSuccessAlert = (message) => {
  showGlobalAlert(message, 'success');
};

export const showErrorAlert = (message, fieldName = null) => {
  if (!fieldName) {
    const existingErrors = document.querySelectorAll('.reg-error-message');
    existingErrors.forEach(error => error.remove());
  }
  
  if (!fieldName) {
    if (message.includes('كلمة المرور') && message.includes('غير متطابقين')) {
      fieldName = 'confirmPassword';
    } else if (message.includes('كلمة المرور') && message.includes('حرف كبير')) {
      fieldName = 'password';
    } else if (message.includes('كلمة المرور') && message.includes('رمز')) {
      fieldName = 'password';
    } else if (message.includes('كلمة المرور') && !message.includes('تأكيد')) {
      fieldName = 'password';
    } else if (message.includes('البريد الإلكتروني')) {
      fieldName = 'email';
    } else if (message.includes('الاسم الأول')) {
      fieldName = 'firstName';
    } else if (message.includes('الاسم الأخير')) {
      fieldName = 'lastName';
    } else if (message.includes('رقم الهاتف')) {
      fieldName = 'phone';
    } else if (message.includes('تاريخ الميلاد')) {
      fieldName = 'birthdate';
    } else if (message.includes('دور المستخدم')) {
      fieldName = 'userRole';
    }
  }
  
  if (fieldName) {
    showFieldAlert(message, fieldName);
  } else {
    showGlobalAlert(message, 'error');
  }
};