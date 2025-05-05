import React from "react";

export default function UserInfoInputs({ formData, errors, formSubmitted, onChange }) {
  return (
    <>
      <div className="flex gap-4">
        <div className="w-1/2">
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className={`reg-input ${errors.lastName && formSubmitted ? 'reg-input-error' : ''}`}
            placeholder="الاسم الأخير *"
          />
          {errors.lastName && formSubmitted && (
            <div className="reg-error-message">
              <div className="alert">
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <p>{errors.lastName}</p>
              </div>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className={`reg-input ${errors.firstName && formSubmitted ? 'reg-input-error' : ''}`}
            placeholder="الاسم الأول *"
          />
          {errors.firstName && formSubmitted && (
            <div className="reg-error-message">
              <div className="alert">
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <p>{errors.firstName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`reg-input ${errors.email && formSubmitted ? 'reg-input-error' : ''}`}
          placeholder="البريد الإلكتروني *"
        />
        {errors.email && formSubmitted && (
          <div className="reg-error-message">
            <div className="alert">
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <p>{errors.email}</p>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <input 
          type="text" 
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className={`reg-input ${errors.phone && formSubmitted ? 'reg-input-error' : ''}`}
          placeholder="رقم الهاتف *"
        />
        {errors.phone && formSubmitted && (
          <div className="reg-error-message">
            <div className="alert">
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <p>{errors.phone}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}