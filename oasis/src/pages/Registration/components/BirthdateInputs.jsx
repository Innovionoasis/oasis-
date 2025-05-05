import React from "react";

export default function BirthdateInputs({ formData, setFormData, errors, formSubmitted }) {
  return (
    <div className="reg-date-container">
      <span className="reg-date-label">تاريخ الميلاد *</span>
      <div className={`reg-date-inputs ${errors.birthdate && formSubmitted ? 'reg-input-error' : ''}`}>
        <div className="w-1/3">
          <select
            name="birthYear"
            value={formData.birthYear || ""}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthYear: e.target.value
              }));
            }}
            className="reg-date-select"
          >
            <option value="">السنة</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="text-gray-400">/</div>

        <div className="w-1/3">
          <select
            name="birthMonth"
            value={formData.birthMonth || ""}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthMonth: e.target.value
              }));
            }}
            className="reg-date-select"
          >
            <option value="">الشهر</option>
            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="text-gray-400">/</div>

        <div className="w-1/3">
          <select
            name="birthDay"
            value={formData.birthDay || ""}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthDay: e.target.value
              }));
            }}
            className="reg-date-select"
          >
            <option value="">اليوم</option>
            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.birthdate && formSubmitted && (
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
            <p>{errors.birthdate}</p>
          </div>
        </div>
      )}
    </div>
  );
}